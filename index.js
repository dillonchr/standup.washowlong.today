import Chart from 'frappe-charts/dist/frappe-charts.min.esm';

const dataUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQtcYrAF_O8sgP1VuIgbFpOXhTp1yRiMaeYKLIUroA0zwWikEo4Vs5Jf8WoCQfVNzWISdygU0_ji1F8/pub?output=tsv';
fetch(dataUrl)
    .then(r => r.text())
    .then(rawData => {
        const standups = rawData
            .split('\n')
            .slice(1)
            .map(r => {
                const [date, duration, hasC] = r.split('\t');
                const seconds = duration.split(':').reduce((sum, cur, i) => {
                    if (i === 0) {
                        return cur * 60;
                    }
                    return +cur + sum;
                }, 0);
                return {
                    date,
                    duration,
                    minutes: seconds / 60,
                    seconds,
                    isTracked: +hasC > 0
                };
            });
        const data = {
            labels: standups.map(s => s.date),
            datasets: [{
                values: standups.map(s => s.minutes)
            }],
            specific_values: [{
                title: 'Target',
                line_type: 'dashed',
                value: 15
            }]
        };
        const chart = new Chart({
            parent: '#chart',
            title: 'Standup Durations (min)',
            data,
            type: 'line',
            height: 250,
            colors: ['#08AEEA'],
            region_fill: 1,
            is_series: 1,
            format_tooltip_y: d => {
                const minutes = Math.floor(d);
                const seconds = (d * 60) % 60;
                return `${minutes}:${seconds}`;
            }
        });
    });
