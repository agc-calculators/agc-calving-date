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
                            <li>
                                <h2 data-i18n="results.calving-date">Calving Date</h2>
                                <span>{this.data['calvingDate']}</span>
                            </li>
                            {!this.data['calved'] && (<li>
                                <h2 data-i18n="results.days-until-calving">Days until Calving</h2>
                                <span>{this.data['daysTillCalving']}</span>
                                <sub data-i18n="results.days">Days</sub>
                            </li>)}
                            {!this.data['calved'] && (<li>
                                <h2 data-i18n="results.days-bred">Days Bred</h2>
                                <span>{this.data['daysBred']}</span>
                                <sub data-i18n="results.days">Days</sub>
                            </li>)}
                            <li>
                                <h2 data-i18n="results.first-partition-begins">First Partition Begins</h2>
                                <span>{this.data['firstPartition'].start}</span>
                            </li>
                            <li>
                                <h2 data-i18n="results.second-partition-begins">Second Partition Begins</h2>
                                <span>{this.data['secondPartition'].start}</span>
                            </li>
                            <li>
                                <h2 data-i18n="results.third-partition-begins">Third Partition Begins</h2>
                                <span>{this.data['thirdPartition'].start}</span>
                            </li>
                            {/* <div class="results-box" data-i18n-label="results.days-until-calving" data-label="Days until Calving">{this.data['daysTillCalving']}</div>
                            <div class="results-box" data-i18n-label="results.days-bred" data-label="Days Bred">{this.data['daysBred']}</div>
                            <div class="results-box" data-i18n-label="results.first-partition-begins" data-label="First Partition Begins">{this.data['firstPartition'].start}</div>
                            <div class="results-box" data-i18n-label="results.second-partition-begins" data-label="Second Partition Begins">{this.data['secondPartition'].start}</div>
                            <div class="results-box" data-i18n-label="results.third-partition-begins" data-label="Third Partition Begins">{this.data['thirdPartition'].start}</div> */}
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
        // Global events allow the control to be separated from the form...
        if (!this.socket) {
            return;
        }
        window.document.addEventListener('agcCalculated', this.handleResults.bind(this));
    }

    componentDidUnload() {
        window.document.removeEventListener('agcCalculated', this.handleResults);
    }
}
