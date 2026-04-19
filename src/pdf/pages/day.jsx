import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import dayjs from 'dayjs/esm';
import PropTypes from 'prop-types';
import React from 'react';

import {
	formatGregorianLong,
	formatHijriDayTitle,
	hijriInfo,
	hijriMonthDayKey,
} from '~/lib/hijri';
import { findByDate } from '~/lib/special-dates-utils';
import Header from '~/pdf/components/header';
import Itinerary from '~/pdf/components/itinerary';
import MiniCalendar from '~/pdf/components/mini-calendar';
import PdfConfig from '~/pdf/config';
import {
	dayPageLink,
	nextDayPageLink,
	previousDayPageLink,
	monthOverviewLink,
} from '~/pdf/lib/links';
import { content, pageStyle } from '~/pdf/styles';
import { splitItemsByPages } from '~/pdf/utils';

class DayPage extends React.Component {
	styles = StyleSheet.create(
		Object.assign( {}, { content, page: pageStyle( this.props.config ) } ),
	);

	renderExtraItems = ( items, index ) => (
		<Page key={ index } size={ this.props.config.pageSize } dpi={ this.props.config.dpi }>
			<View style={ this.styles.page }>
				<Itinerary items={ items } />
			</View>
		</Page>
	);

	render() {
		const { date, config } = this.props;
		const { items, isEnabled } = config.dayItineraries[ date.weekday() ];
		if ( ! isEnabled ) {
			return null;
		}
		const itemsByPage = splitItemsByPages( items );

		const specialDateKey = hijriMonthDayKey( this.props.date );
		const specialItems = this.props.config.specialDates.filter(
			findByDate( specialDateKey ),
		);
		const { hd } = hijriInfo( date );
		const subtitle = (
			<Text style={ { fontSize: 12 } }>{formatGregorianLong( date )}</Text>
		);
		return (
			<>
				<Page id={ dayPageLink( date, config ) } size={ config.pageSize } dpi={ config.dpi }>
					<View style={ this.styles.page }>
						<Header
							isLeftHanded={ config.isLeftHanded }
							title={ formatHijriDayTitle( date ) }
							titleUppercase={ false }
							titleSize={ 18 }
							titleLink={ '#' + monthOverviewLink( date, config ) }
							subtitle={ subtitle }
							subtitleUppercase={ false }
							number={ String( hd ).padStart( 2, '0' ) }
							previousLink={ '#' + previousDayPageLink( date, config ) }
							nextLink={ '#' + nextDayPageLink( date, config ) }
							calendar={ <MiniCalendar date={ date } config={ config } /> }
							specialItems={ specialItems }
						/>
						<View style={ this.styles.content }>
							<Itinerary items={ itemsByPage[ 0 ] } />
						</View>
					</View>
				</Page>
				{itemsByPage.slice( 1 ).map( this.renderExtraItems )}
			</>
		);
	}
}

DayPage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
};

export default DayPage;
