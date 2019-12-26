import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';

class Layout extends React.Component {
	render() {
		return (
			<div
				className={`background-${this.props.background} container-fluid full-height`}>
				<div className={`background-${this.props.background} row`}>
					<div className="col-md-12">
						<div className="text-right">
							<FontAwesomeIcon
								icon={faMoon}
								onClick={() => this.props.setBackground()}
							/>
						</div>
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}

export default Layout;
