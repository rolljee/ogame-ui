import React from 'react';
import { useI18n } from '../../i18n/I18nContext';

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
			<h2 className="result-title">{t('mb.curve.title')}</h2>
			<p className="help">{t('mb.curve.help', { attackers: attackerCount })}</p>

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
					.map(({ target, rip }) => (
						<g key={target}>
							<line
								className="mb-curve-target"
								x1={x(rip)}
								x2={x(rip)}
								y1={y(target)}
								y2={y(0)}
							/>
							<text className="mb-curve-target-label" x={x(rip)} y={y(target) - 5}>
								{target}%
							</text>
						</g>
					))}

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
							y={y(current.probability) - 10}
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
				<text className="mb-curve-tick" x={WIDTH - PAD.right} y={HEIGHT - 8} textAnchor="end">
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
