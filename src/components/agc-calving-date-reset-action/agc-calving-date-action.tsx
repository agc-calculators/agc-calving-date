import { Component, Event, EventEmitter, Prop } from '@stencil/core';

@Component({
    tag: 'agc-calving-date-action',
    styleUrl: 'agc-calving-date-action.css'
})
export class AgcCalvingDateAction {

    @Prop() socket: string = ""
    @Prop() action: 'reset' | 'move' = 'reset'
    @Prop() actionText: string = "⟳ Start Over"

    @Event({
        eventName: 'agcAction'
    }) agcAction: EventEmitter;

    render() {
        return (
            <button class={`agc-wizard__actions-${this.action}`} onClick={this.doAction.bind(this)}>{this.actionText}</button>
        );
    }

    doAction(e:UIEvent) {
        e && e.preventDefault()
        if (!this.socket) { return }

        this.agcAction.emit({socket: this.socket, action: this.action})
    }
}
