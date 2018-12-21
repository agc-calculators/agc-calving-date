import { Component, State, Event, EventEmitter, Prop } from '@stencil/core';

import { addDays, formatDate, inputDate, daysBetween } from '../../utils'

@Component({
    tag: 'agc-calving-date',
    styleUrl: 'agc-calving-date.css'
})
export class AgcCalvingDate {

    @Prop() socket: string = ""
    @Prop() shadow: boolean = false
    @Prop() mode: 'full' | 'step' = 'step'
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
                    data-wizard-mode={this.mode}
                    class={`agc-wizard${this.shadow ? ' shadow' : '' }`}>
                    <slot></slot>
                    <section data-wizard-section="1">
                        <div class="agc-wizard__field">
                            <label data-i18n="fields.breeding-date">Breeding Date</label>
                            <input name="breedingDate" type="date" required />
                            <p class="agc-wizard__validation-message" data-i18n="validation.breeding-date.required" data-validates="breedingDate">Please enter a valid date.</p>
                            <p>⮤ Enter the date that the heifer or cow was bred.</p>
                        </div>
                        {this.mode === 'step' && (<div class="agc-wizard__actions">
                            <button class="agc-wizard__actions-next" data-i18n="actions.next" onClick={this.nextPrev.bind(this, 1)}>Next 🠖</button>
                        </div>)}
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
                            <p>⮤ Select the number of days in the gestation period.</p>
                        </div>
                        <div class="agc-wizard__actions">
                            {this.mode === 'step' && (<button class="agc-wizard__actions-back" data-i18n="actions.back" onClick={this.nextPrev.bind(this, -1)}>🠔 Back</button>)}
                            <button class="agc-wizard__actions-next" data-i18n="actions.finish" onClick={this.nextPrev.bind(this, this.mode === 'step' ? 1 : 2)}>Calculate 🠖</button>
                        </div>
                    </section>
                    <section data-wizard-results>                        
                        <slot name="results"></slot>                     
                    </section>
                </form>
            </div>
        );
    }

    showTab(n) {
        // This function will display the specified section of the form... 
        if (this.mode === 'step') {       
            this.cache['sections'][n].style.display = "block";
        }

        if (this.socket) {
            this.agcStepChanged.emit({socket: this.socket, step: this.currentStep})
        }
    }

    reset() {
        this.currentStep = 0
        this.submitted = false
        this.showTab(0)
    }

    validateForm () {
        let valid = true;

        if (this.currentStep === 0 || this.mode === 'full') {
            let breedingDate = this.form.querySelector('[name="breedingDate"]') as HTMLInputElement
            let breedingDateMessage = this.form.querySelector('[data-validates="breedingDate"') as HTMLParagraphElement
            
            if (!breedingDate.checkValidity()) {
                valid = false;
                if (breedingDate.className.indexOf('invalid') === -1) {
                    breedingDate.className += " invalid";
                }
                breedingDateMessage.style.display = 'block';
            } else {
                breedingDate.className = breedingDate.className.replace(" invalid", "");
                breedingDateMessage.style.display = 'none';
            }
        }
        

        return valid;
    }

    nextPrev(n, e) {
        e && e.preventDefault()
        // Exit the function if any field in the current section is invalid:
        if (this.mode === 'full') {
            if (!this.validateForm()) return false
        } else if (n == 1 && !this.validateForm()) return false

        // Hide the current tab:
        if (this.mode === 'step') {
            this.cache['sections'][this.currentStep].style.display = "none"
        }
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
        let daysInPartition = Math.floor(gestationPeriod / 3);
        let calvingDate = addDays(breedingDate, gestationPeriod)
        let daysTillCalving = daysBetween(new Date(), calvingDate)
        let daysBred = daysBetween(breedingDate, new Date());
        // let firstPartitionStartDay = 1;
        // let firstPartitionEndDay = daysInPartition;
        let calved = calvingDate <= new Date();
        let bred = breedingDate <= new Date();

        let firstPartition = {
            id: 'first',
            start: formatDate(addDays(breedingDate, 1), "/"),
            end: formatDate(addDays(breedingDate, daysInPartition), "/"),
            dayStart: 1,
            dayEnd: daysInPartition,
            isCurrent: daysBred <= daysInPartition
        }
        let secondPartition = {
            id: 'second',
            start: formatDate(addDays(breedingDate, daysInPartition + 1), "/"),
            end: formatDate(addDays(breedingDate, (daysInPartition * 2) + 1), "/"),
            dayStart: daysInPartition + 1,
            dayEnd: daysInPartition * 2,
            isCurrent: (daysBred >= daysInPartition + 1) && (daysBred <= (daysInPartition * 2) + 1)
        }
        let thirdPartition = {
            id: 'third',
            start: formatDate(addDays(breedingDate, 190), "/"),
            end: formatDate(calvingDate, "/"),
            dayStart: (daysInPartition * 2) + 1,
            dayEnd: gestationPeriod,
            isCurrent: daysBred >= 190
        }

        let current = [firstPartition, secondPartition, thirdPartition].filter(c => c.isCurrent);

        let results = {
            breedingDate: formatDate(breedingDate, "/"),
            gestationPeriod: gestationPeriod,
            calvingDate: formatDate(calvingDate, "/"),
            daysTillCalving: daysTillCalving,
            daysBred: daysBred,
            firstPartition: firstPartition,
            secondPartition: secondPartition,
            thirdPartition: thirdPartition,
            currentPartition: current.length ? current[0].id : '',
            calved: calved,
            bred: bred,
            inputs: {
                breedingDate: { text: 'Breeding Date', i18n: 'results.breeding-date', type: 'date', value: formatDate(breedingDate, "/") },
                gestationPeriod: { text: 'Gestation Period', i18n: 'results.gestation-period', type: 'number', value: gestationPeriod }                
            },
            outputs: {
                calvingDate: { text: 'Calving Date', i18n: 'results.calving-date', type: 'date', value: formatDate(calvingDate, "/")},
                daysTillCalving: { text: 'Days until Calving', i18n: 'results.days-until-calving', type: 'number', value: daysTillCalving },
                daysBred: { text: 'Days Bred', i18n: 'results.days-bred', type: 'number', value: daysBred },
                firstPartition: { text: 'First Partition', i18n: 'results.first-partition', type: 'object', value: firstPartition, fields: {
                    start: { text: 'Start', i18n: 'results.start-date', type: 'date', value: firstPartition.start },
                    end: { text: 'End', i18n: 'results.end-date', type: 'date', value: firstPartition.end }
                }},
                secondPartition: { text: 'Second Partition', i18n: 'results.second-partition', type: 'object', value: secondPartition, fields: {
                    start: { text: 'Start', i18n: 'results.start-date', type: 'date', value: secondPartition.start },
                    end: { text: 'End', i18n: 'results.end-date', type: 'date', value: secondPartition.end }
                }},
                thirdPartition: { text: 'Third Partition', i18n: 'results.third-partition', type: 'object', value: thirdPartition, fields: {
                    start: { text: 'Start', i18n: 'results.start-date', type: 'date', value: thirdPartition.start },
                    end: { text: 'End', i18n: 'results.end-date', type: 'date', value: firstPartition.end }
                }},
            }
        }

        if (this.socket) {
            this.agcCalculated.emit({socket: this.socket, results: {...results}})
        }

        this.results = {...results}
        
        this.cache['results'].forEach(result => {
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

        (this.form.querySelector('[name="breedingDate"]') as HTMLInputElement)!.defaultValue = inputDate(new Date());

        this.showTab(0)
    }

    componentDidUnload() {
        window.document.removeEventListener('agcAction', this.handleAction);
    }
}
