import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { HelpNote } from '../../components/Layout';

// Chart box in user units; the SVG scales to its container.
const WIDTH = 320;
const HEIGHT = 176;
const PAD = { left: 30, right: 10, top: 10, bottom: 26 };

const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;

// Recessive gridlines every 25 %, labelled every 50 % to keep the axis quiet.
const GRID = [0, 25, 50, 75, 100];

// A single series showing how the chance climbs with the fleet size: a line,
// with the fleet currently entered marked on it. One series, so no legend — the
// title names it — and the values are also available as a table below.
function MoonbreakCurve({ curve, attackerCount }) {
	const { t } = useI18n();

	const { points, upTo, targets } = curve;

	const x = (rip) => PAD.left + ((rip - 1) / Math.max(upTo - 1, 1)) * PLOT_W;
	const y = (probability) => PAD.top + ((100 - probability) / 100) * PLOT_H;

	const line = points.map((point) => `${x(point.rip)},${y(point.probability)}`).join(' ');
	const current = points.find((point) => point.current);

	return (
		<div className="result mb-curve">
			<div className="result-head">
				<h2 className="result-title">{t('mb.curve.title')}</h2>
				<HelpNote>{t('mb.curve.help', { attackers: attackerCount })}</HelpNote>
			</div>

			<svg
				className="mb-curve-chart"
				viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
				role="img"
				aria-label={t('mb.curve.aria', {
					rip: upTo,
					probability: points[points.length - 1].probability,
				})}
			>
				{GRID.map((value) => (
					<g key={value}>
						<line
							className="mb-curve-grid"
							x1={PAD.left}
							x2={WIDTH - PAD.right}
							y1={y(value)}
							y2={y(value)}
						/>
						{value % 50 === 0 && (
							<text className="mb-curve-tick" x={PAD.left - 6} y={y(value) + 3.5}>
								{value}%
							</text>
						)}
					</g>
				))}

				{/* Where each threshold is reached — the number people actually want. */}
				{targets
					.filter(({ rip }) => rip !== null && rip <= upTo)
					// The fleet's own point is labelled already; a threshold right
					// next to it would print over that label.
					.filter(({ rip }) => !current || Math.abs(x(rip) - x(current.rip)) > 36)
					.map(({ target, rip }) => (
						<g key={target}>
							<line
								className="mb-curve-target"
								x1={x(rip)}
								x2={x(rip)}
								y1={y(target)}
								y2={y(0)}
							/>
							<text className="mb-curve-target-label" x={x(rip) + 4} y={y(0) - 5} textAnchor="start">
								{target}%
							</text>
						</g>
					))}

				{/* The area under the curve, closed down to the 0 % line. */}
				<polygon
					className="mb-curve-area"
					points={`${x(points[0].rip)},${y(0)} ${line} ${x(points[points.length - 1].rip)},${y(0)}`}
				/>
				<polyline className="mb-curve-line" points={line} />

				{current && (
					<>
						<circle
							className="mb-curve-point"
							cx={x(current.rip)}
							cy={y(current.probability)}
							r="4"
						/>
						<text
							className="mb-curve-point-label"
							x={x(current.rip)}
							// Above the point, unless that would leave the plot: then under the line.
							y={
								y(current.probability) - 10 > PAD.top + 8
									? y(current.probability) - 10
									: y(current.probability) + 18
							}
							dx={current.rip > upTo / 2 ? -8 : 8}
							textAnchor={current.rip > upTo / 2 ? 'end' : 'start'}
						>
							{t('mb.curve.point', {
								rip: current.rip,
								probability: current.probability,
							})}
						</text>
					</>
				)}

				{/* Bigger than the marks, so a point is easy to hit; the native tooltip
				    keeps the hover layer free of extra state. */}
				{points.map((point) => (
					<circle
						key={point.rip}
						className="mb-curve-hit"
						cx={x(point.rip)}
						cy={y(point.probability)}
						r="7"
					>
						<title>{t('mb.curve.point', { rip: point.rip, probability: point.probability })}</title>
					</circle>
				))}

				<text className="mb-curve-tick" x={PAD.left} y={HEIGHT - 8}>
					1
				</text>
				<text className="mb-curve-tick" x={WIDTH - PAD.right - 6} y={HEIGHT - 8} textAnchor="end">
					{t('mb.curve.axisX', { rip: upTo })}
				</text>
			</svg>

			<ul className="mb-curve-targets">
				{targets.map(({ target, rip }) => (
					<li key={target}>
						{rip === null
							? t('mb.curve.unreachable', { target, attackers: attackerCount })
							: t('mb.curve.target', { target, rip })}
					</li>
				))}
			</ul>

			<details className="mb-curve-table">
				<summary>{t('mb.curve.table')}</summary>
				<table>
					<thead>
						<tr>
							<th scope="col">{t('mb.curve.col.rip')}</th>
							<th scope="col">{t('mb.curve.col.probability')}</th>
						</tr>
					</thead>
					<tbody>
						{points.map((point) => (
							<tr key={point.rip}>
								<td>{point.rip}</td>
								<td>{point.probability}%</td>
							</tr>
						))}
					</tbody>
				</table>
			</details>
		</div>
	);
}

export default MoonbreakCurve;
