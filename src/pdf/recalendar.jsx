import { Document, StyleSheet } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

import { addHijriMonths, dayjsFromHijri, hijriInfo } from '~/lib/hijri';
import PdfConfig from '~/pdf/config';
import DayPage from '~/pdf/pages/day';
import LastPage from '~/pdf/pages/last';
import MonthOverviewPage from '~/pdf/pages/month-overview';
import WeekOverviewPage from '~/pdf/pages/week-overview';
import WeekRetrospectivePage from '~/pdf/pages/week-retrospective';
import YearOverviewPage from '~/pdf/pages/year-overview';

class RecalendarPdf extends React.Component {
	styles = StyleSheet.create( {
		document: {
			fontFamily: this.props.config.fontFamily,
		},
		page: {
			flexDirection: 'row',
			backgroundColor: '#E4E4E4',
		},
	} );

	renderWeek( startOfWeek ) {
		const { config } = this.props;

		const weekPages = [];
		let currentDate = startOfWeek.clone();
		const endOfWeek = startOfWeek.add( 1, 'weeks' );
		while ( currentDate.isBefore( endOfWeek ) ) {
			// Insert a month overview whenever we hit the first day of a Hijri month.
			if ( config.isMonthOverviewEnabled && hijriInfo( currentDate ).hd === 1 ) {
				weekPages.push(
					<MonthOverviewPage
						key={ 'month-overview-' + currentDate.unix() }
						date={ currentDate }
						config={ config }
					/>,
				);
			}
			const key = 'day-' + currentDate.unix();
			weekPages.push( <DayPage key={ key } date={ currentDate } config={ config } /> );
			currentDate = currentDate.add( 1, 'days' );
		}
		return (
			<React.Fragment key={ 'week-' + startOfWeek.unix() }>
				{config.isWeekOverviewEnabled && (
					<WeekOverviewPage date={ startOfWeek } config={ config } />
				)}
				{weekPages}
				{config.isWeekRetrospectiveEnabled && (
					<WeekRetrospectivePage date={ startOfWeek } config={ config } />
				)}
			</React.Fragment>
		);
	}

	renderCalendar() {
		const { year, month, monthCount } = this.props.config;
		const pageList = [];
		// `year`/`month` are Hijri (month is 0-indexed: 0 = Muharram).
		let currentDate = dayjsFromHijri( year, month + 1, 1 );
		const endDate = addHijriMonths( currentDate, monthCount );

		pageList.push(
			<YearOverviewPage
				key={ 'year-overview-' + year }
				startDate={ currentDate }
				endDate={ endDate }
				config={ this.props.config }
			/>,
		);

		const previewStopDate = addHijriMonths( currentDate, 1 );
		currentDate = currentDate.startOf( 'week' );
		while ( currentDate.isBefore( endDate ) ) {
			pageList.push( this.renderWeek( currentDate ) );

			currentDate = currentDate.add( 1, 'weeks' );
			if ( this.props.isPreview && currentDate.isAfter( previewStopDate ) ) {
				break;
			}
		}

		pageList.push( <LastPage key="last" config={ this.props.config } /> );

		return pageList;
	}

	render() {
		return (
			<Document style={ this.styles.document }>{this.renderCalendar()}</Document>
		);
	}
}

RecalendarPdf.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	isPreview: PropTypes.bool.isRequired,
};

export default RecalendarPdf;
