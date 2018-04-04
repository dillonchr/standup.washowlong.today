import Chart from 'frappe-charts/dist/frappe-charts.min.esm';

const dataUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQtcYrAF_O8sgP1VuIgbFpOXhTp1yRiMaeYKLIUroA0zwWikEo4Vs5Jf8WoCQfVNzWISdygU0_ji1F8/pub?output=tsv';
fetch(dataUrl)
    .then(r => r.text())
    .then(rawData => {
        const standups = rawData
            .split('\n')
            .slice(1)
            .map(r => {
                const [date, duration, tracked] = r.split('\t');
                const seconds = duration.split(':').reduce((sum, cur, i) => {
                    if (i === 0) {
                        return cur * 60;
                    }
                    return +cur + sum;
                }, 0);
                console.log('calculated', seconds, 'to be', (seconds / 60).toFixed(2));
                return {
                    date,
                    duration,
                    minutes: seconds / 60,
                    isTracked: +tracked > 0
                };
            })
            .filter(s => s.isTracked);

        const displayedStandups = standups.slice(standups.length - 10);

        const specific_values = [
            {
                title: 'Target',
                line_type: 'dashed',
                value: 15
            }
        ];
        const average = standups.reduce((sum, t) => sum + t.minutes, 0) / standups.length;

        if (Math.abs(average - 15) > 5) {
            specific_values.push({
                title: 'Average',
                line_type: 'dashed',
                value: average
            });
        }

        const data = {
            labels: displayedStandups.map(s => s.date),
            datasets: [{
                values: displayedStandups.map(s => s.minutes)
            }],
            specific_values
        };

        const dataToMinuteStamp = d => {
            const minutes = Math.floor(d);
            const seconds = (d * 60) % 60;
            return `${minutes}:${seconds.toString().substr(0, 2).padStart(2, '0')}`;
        };

        const chart = new Chart({
            parent: '#chart',
            title: '10 Latest standup durations (min)',
            data,
            type: 'line',
            height: 250,
            colors: ['#08AEEA'],
            region_fill: 1,
            is_series: 1,
            format_tooltip_y: dataToMinuteStamp
        });

        document.querySelector('#standup-count').textContent = standups.length;
        const averageElem = document.querySelector('#standup-average');
        averageElem.textContent = dataToMinuteStamp(average);
        averageElem.classList.toggle('over-target', average > 15);
    });
