import { Component } from '@stencil/core';


@Component({
    tag: 'agc-calving-date-results-placeholder',
    styleUrl: 'agc-calving-date-results-placeholder.css'
})
export class AgcCalvingDateResultsPlaceholder {

    

    render() {
        const placeholder = () => <span><i class="mark"></i> <i class="mark"></i> <i class="mark"></i> <i class="mark"></i></span>

        return (
            <section>
                <ul class="agc-results-placeholder">
                    <li>
                        <h2 data-i18n="results.calving-date">Calving Date</h2>
                        {placeholder()}
                    </li>
                    <li>
                        <h2 data-i18n="results.days-until-calving">Days until Calving</h2>
                        {placeholder()}
                    </li>
                    <li>
                        <h2 data-i18n="results.days-bred">Days Bred</h2>
                        {placeholder()}
                    </li>
                    <li>
                        <h2 data-i18n="results.first-partition-begins">First Partition Begins</h2>
                        {placeholder()}
                    </li>
                    <li>
                        <h2 data-i18n="results.second-partition-begins">Second Partition Begins</h2>
                        {placeholder()}
                    </li>
                    <li>
                        <h2 data-i18n="results.third-partition-begins">Third Partition Begins</h2>
                        {placeholder()}
                    </li>                    
                </ul>
            </section>
        );
    }
}
