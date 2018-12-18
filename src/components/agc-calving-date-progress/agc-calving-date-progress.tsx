import { Component, State, Prop } from '@stencil/core';

@Component({
    tag: 'agc-calving-date-progress',
    styleUrl: 'agc-calving-date-progress.css'
})
export class AgcCalvingDateProgress {
    @Prop() socket:string = ""
    @State() currentStep = -1
    progress: HTMLDivElement;

    render() {
        return (
            <div ref={c => this.progress = c as HTMLDivElement} class="wizard__progress">
                <span class={`step${this.currentStep > 0 ? ' finish': ''}${this.currentStep === 0 ? ' active' : ''}`}></span>
                <span class={`step${this.currentStep > 1 ? ' finish': ''}${this.currentStep === 1 ? ' active' : ''}`}></span>                
            </div>
        );
    }

    componentDidLoad() {
        // Global events allow the control to be separated from the form...
        window.document.addEventListener('agcStepChanged', this.agcStepChangedHandler.bind(this));
        window.document.addEventListener('agcCalculated', this.agcCalculatedHandler.bind(this));
    }

    agcStepChangedHandler(event: CustomEvent) {
        console.log('step changed', event)
        if (event!.detail['socket'] !== this.socket) { return; }
        this.currentStep = parseInt(event.detail['step'])
    }

    agcCalculatedHandler(event: CustomEvent) {
        console.log('calculated', event)
        if (event!.detail['socket'] !== this.socket) { return; }
        console.log('Received the custom calculated event: ', event.detail);
        this.currentStep = 2
        this.progress.classList.add('complete')
    }
}
