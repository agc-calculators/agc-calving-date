import { Component, Prop, State } from '@stencil/core';


@Component({
    tag: 'agc-calving-date-results',
    styleUrl: 'agc-calving-date-results.css'
})
export class AgcCalvingDateResults {
    @Prop() socket: string = ""
    @State() data: any
    @State() ready: boolean = false

    render() {
        
        return (
            <section data-wizard-results>
                <div style={{display: this.ready ? 'none' : 'block'}}>
                    <slot name="empty"></slot>
                </div>
                <div style={{display: this.ready ? 'block' : 'none'}}>
                    {this.data && (<ul class="agc-results">
                            <li data-result="calvingDate">
                                <h2 data-i18n="results.calving-date">Calving Date</h2>
                                <span>{this.data['calvingDate']}</span>                                
                            </li>
                            {!this.data['calved'] && (<li data-result="daysTillCalving">
                                <h2 data-i18n="results.days-until-calving">Days until Calving</h2>
                                <span>{this.data['daysTillCalving']}</span>
                            </li>)}
                            {!this.data['calved'] && (<li data-result="daysBred">
                                <h2 data-i18n="results.days-bred">Days Bred</h2>
                                <span>{this.data['daysBred']}</span>
                            </li>)}
                            <li data-result="firstPartition">
                                <h2 data-i18n="results.first-partition-begins">First Partition Begins</h2>
                                <span>{this.data['firstPartition'].start}</span>
                            </li>
                            <li data-result="secondPartition">
                                <h2 data-i18n="results.second-partition-begins">Second Partition Begins</h2>
                                <span>{this.data['secondPartition'].start}</span>
                            </li>
                            <li data-result="thirdPartition">
                                <h2 data-i18n="results.third-partition-begins">Third Partition Begins</h2>
                                <span>{this.data['thirdPartition'].start}</span>
                            </li>
                        </ul>)}
                </div>
            </section>
        );
    }

    handleResults(e:CustomEvent) {
        if (e.detail['socket'] !== this.socket) { return; }
        this.data = {...e.detail['results']};
        this.ready = true;
    }

    componentDidLoad() {
        if (!this.socket) {
            return;
        }
        window.document.addEventListener('agcCalculated', this.handleResults.bind(this));
    }

    componentDidUnload() {
        window.document.removeEventListener('agcCalculated', this.handleResults);
    }
}
