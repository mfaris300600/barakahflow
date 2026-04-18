import { Page, View, StyleSheet } from '@react-pdf/renderer';
import dayjs from 'dayjs/esm';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import { getWeekNumber } from '~/lib/date';
import { hijriInfo, hijriMonthName } from '~/lib/hijri';
import Header from '~/pdf/components/header';
import Itinerary from '~/pdf/components/itinerary';
import MiniCalendar, { HIGHLIGHT_WEEK } from '~/pdf/components/mini-calendar';
import PdfConfig from '~/pdf/config';
import { weekRetrospectiveLink } from '~/pdf/lib/links';
import { content, pageStyle } from '~/pdf/styles';
import { splitItemsByPages } from '~/pdf/utils';

class WeekRetrospectivePage extends React.Component {
	styles = StyleSheet.create(
		Object.assign( {}, { content, page: pageStyle( this.props.config ) } ),
	);

	getNameOfWeek() {
		const { date } = this.props;
		const start = date.startOf( 'week' );
		const end = date.endOf( 'week' );
		const startInfo = hijriInfo( start );
		const endInfo = hijriInfo( end );
		const startHijri = `${startInfo.hd} ${hijriMonthName( startInfo.hm, 'short' )}`;
		const endHijri = `${endInfo.hd} ${hijriMonthName( endInfo.hm, 'short' )} ${endInfo.hy}`;
		const gregRange = `${start.format( 'DD MMM' )} – ${end.format( 'DD MMM YYYY' )}`;
		return `${startHijri} – ${endHijri}  ·  ${gregRange}`;
	}

	render() {
		const { t, date, config } = this.props;
		const itemsByPage = splitItemsByPages( config.weekRetrospectiveItinerary );
		return (
			<>
				<Page id={ weekRetrospectiveLink( date ) } size={ config.pageSize } dpi={ config.dpi }>
					<View style={ this.styles.page }>
						<Header
							isLeftHanded={ config.isLeftHanded }
							title={ t( 'page.retrospective.title' ) }
							titleSize={ 15 }
							subtitle={ this.getNameOfWeek() }
							subtitleSize={ 18 }
							number={ getWeekNumber( date ).toString() }
							previousLink={
								'#' + weekRetrospectiveLink( date.subtract( 1, 'week' ) )
							}
							nextLink={ '#' + weekRetrospectiveLink( date.add( 1, 'week' ) ) }
							calendar={
								<MiniCalendar
									date={ date }
									highlightMode={ HIGHLIGHT_WEEK }
									config={ config }
								/>
							}
						/>
						<View style={ this.styles.content }>
							<Itinerary items={ itemsByPage[ 0 ] } />
						</View>
					</View>
				</Page>
				{itemsByPage.slice( 1 ).map(
					( items, index ) => (
						<Page key={ index } size={ config.pageSize } dpi={ config.dpi }>
							<View style={ this.styles.page }>
								<Itinerary items={ items } />
							</View>
						</Page>
					),
				)}
			</>
		);
	}
}

WeekRetrospectivePage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'pdf' )( WeekRetrospectivePage );
