import { Component, State, Event, EventEmitter, Prop } from '@stencil/core';

import { addDays, inputDate, formatDate } from '../../utils'

@Component({
    tag: 'agc-calving-date',
    styleUrl: 'agc-calving-date.css'
})
export class AgcCalvingDate {

    @Prop() socket: string = ""
    @Prop() shadow: boolean = false
    @State() currentStep = 0
    @State() cache = {}
    @State() submitted = false
    @State() results = {}
    @Event({
        eventName: 'agcCalculated'
      }) agcCalculated: EventEmitter;
    @Event({
        eventName: 'agcStepChanged'
    }) agcStepChanged: EventEmitter;

    form: HTMLFormElement

    render() {
        return (
            <div>
                <form onSubmit={(e) => e.preventDefault()} ref={c => this.form = c as HTMLFormElement} data-wizard="agc-calving-date" 
                    class={`agc-wizard${this.shadow ? ' shadow' : '' }`}>
                    <slot></slot>
                    <section data-wizard-section="1">
                        <div class="agc-wizard__field">
                            <label data-i18n="fields.breeding-date">Breeding Date</label>
                            <input name="breedingDate" type="date" value={inputDate(new Date())} />
                        </div>
                        <div class="agc-wizard__actions">
                            <button class="agc-wizard__actions-next" data-i18n="actions.next" onClick={this.nextPrev.bind(this, 1)}>Next 🠖</button>
                        </div>
                    </section>
                    <section data-wizard-section="2">
                        <div class="agc-wizard__field">
                            <label data-i18n="fields.gestation-period">Gestation Period</label>
                            <select name="gestationPeriod">
                                <option value="279" data-i18n="options.gestation-period.279">279 Days</option>
                                <option value="280" data-i18n="options.gestation-period.280">280 Days</option>
                                <option value="281" data-i18n="options.gestation-period.281">281 Days</option>
                                <option value="282" data-i18n="options.gestation-period.282">282 Days</option>
                                <option value="283" data-i18n="options.gestation-period.283" selected>283 Days</option>
                                <option value="284" data-i18n="options.gestation-period.284">284 Days</option>
                                <option value="285" data-i18n="options.gestation-period.285">285 Days</option>
                                <option value="286" data-i18n="options.gestation-period.286">286 Days</option>
                                <option value="287" data-i18n="options.gestation-period.287">287 Days</option>
                            </select>
                        </div>
                        <div class="agc-wizard__actions">
                            <button class="agc-wizard__actions-back" data-i18n="actions.back" onClick={this.nextPrev.bind(this, -1)}>🠔 Back</button>
                            <button class="agc-wizard__actions-next" data-i18n="actions.next" onClick={this.nextPrev.bind(this, 1)}>Next 🠖</button>
                        </div>
                    </section>
                    <section data-wizard-results style={{display: this.submitted ? 'block' : 'none'}}>
                        <p>Calving Date: {this.results['calvingDate']}</p>
                        <slot name="results"></slot>                     
                    </section>
                    <div class="agc-wizard__actions centered" style={{display: this.submitted ? 'block' : 'none'}}>
                        <agc-calving-date-action action="reset" socket={this.socket}></agc-calving-date-action>
                    </div>
                </form>
            </div>
        );
    }

    showTab(n) {
        // This function will display the specified tab of the form...        
        this.cache['sections'][n].style.display = "block";

        if (this.socket) {
            console.log(this.socket, this.currentStep)
            this.agcStepChanged.emit({socket: this.socket, step: this.currentStep})
        }
    }

    reset() {
        this.currentStep = 0
        this.submitted = false
        this.showTab(0)
    }

    validateForm () {
        return true
    }

    nextPrev(n, e) {
        e && e.preventDefault()
        // Exit the function if any field in the current tab is invalid:
        if (n == 1 && !this.validateForm()) return false
        // Hide the current tab:
        this.cache['sections'][this.currentStep].style.display = "none"
        // Increase or decrease the current tab by 1:
        this.currentStep = this.currentStep + n
        // if you have reached the end of the form...
        if (this.currentStep >= this.cache['sections'].length) {
            // ... the form gets submitted:
            this.submitted = true
            this.showResults.call(this);
            return false;
        }
        // Otherwise, display the correct tab:
        this.showTab.call(this, this.currentStep);
    }

    showResults() {
        let breedingDate =  (this.form.querySelector('[name="breedingDate"') as HTMLInputElement).valueAsDate
        let gestationPeriod = parseInt((this.form.querySelector('[name="gestationPeriod"]') as HTMLSelectElement).value)
        
        let results = {
            breedingDate: formatDate(breedingDate, "/"),
            gestationPeriod: gestationPeriod,
            calvingDate: formatDate(addDays(breedingDate, gestationPeriod), "/")
        }

        if (this.socket) {
            this.agcCalculated.emit({socket: this.socket, results: {...results}})
        }

        this.results = {...results}
        
        this.cache['results'].forEach(result => {
            result.setAttribute('results', JSON.stringify(results))
            result.style.display = 'block'
        })
    }

    handleAction(e:CustomEvent) {
        if (e.detail['action'] === 'reset') {
            this.reset();
        }
    }

    componentDidLoad() {
        var sections = Array.from(this.form.querySelectorAll('[data-wizard-section]')).map(c => c as any).map(c => c as HTMLElement)
        var results = Array.from(this.form.querySelectorAll('[data-wizard-results]')).map(c => c as any).map(c => c as HTMLElement)
        this.cache = {...this.cache, sections: sections, results: results}

        window.document.addEventListener('agcAction', this.handleAction.bind(this));

        this.showTab(0)
    }
}
