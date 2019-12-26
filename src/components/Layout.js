import React from 'react';

class Layout extends React.Component {
	render() {
		const { children } = this.props;
		return (
			<div className="container-fluid full-height">
				<div className="container">
					<div className="col-xs-12">{children}</div>
				</div>
			</div>
		);
	}
}

export default Layout;
