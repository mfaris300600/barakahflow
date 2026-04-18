import { hijriMonthKey, startOfHijriMonth } from '~/lib/hijri';

export function dayPageLink( date, config ) {
	const dayLink = findEnabledDayPageLink( date, config, 1 );
	if ( dayLink ) {
		return dayLink;
	}

	if ( config.isWeekOverviewEnabled ) {
		// This ensures that we use the correct year for things like week 52
		// that has days from this and next year
		return weekOverviewLink( date.startOf( 'week' ), config );
	}

	if ( config.isMonthOverviewEnabled ) {
		return monthOverviewLink( date, config );
	}

	return '';
}

export function nextDayPageLink( date, config ) {
	const currentDate = date.add( 1, 'day' );
	return findEnabledDayPageLink( currentDate, config, 1 );
}

export function previousDayPageLink( date, config ) {
	const currentDate = date.subtract( 1, 'day' );
	return findEnabledDayPageLink( currentDate, config, -1 );
}

function findEnabledDayPageLink( date, config, step ) {
	for ( let i = 0; i < config.dayItineraries.length; i++ ) {
		const currentDayItinerary = config.dayItineraries.find(
			findDayOfWeek( date.day() ),
		);
		if ( ! currentDayItinerary || ! currentDayItinerary.isEnabled ) {
			date = date.add( step, 'day' );
			continue;
		}

		return 'day-' + date.format( 'DDMMYYYY' );
	}

	return '';
}

function findDayOfWeek( needle ) {
	return ( { dayOfWeek } ) => dayOfWeek === needle;
}

export function monthOverviewLink( date, config ) {
	if ( config.isMonthOverviewEnabled ) {
		return 'month-' + hijriMonthKey( date );
	}

	const firstDayOfHijriMonth = startOfHijriMonth( date );
	const dayLink = findEnabledDayPageLink( firstDayOfHijriMonth, config, 1 );
	if ( dayLink ) {
		return dayLink;
	}

	if ( config.isWeekOverviewEnabled ) {
		return weekOverviewLink( firstDayOfHijriMonth.startOf( 'week' ), config );
	}

	return '';
}

export function weekOverviewLink( date, config ) {
	if ( config.isWeekOverviewEnabled ) {
		return 'week-overview-' + date.format( 'WWYYYY' );
	}

	const dayLink = findEnabledDayPageLink( date.weekday( 0 ), config, 1 );
	if ( dayLink ) {
		return dayLink;
	}

	if ( config.isMonthOverviewEnabled ) {
		return monthOverviewLink( date, config );
	}

	return '';
}

export function weekRetrospectiveLink( date ) {
	return 'week-retrospective-' + date.format( 'WWYYYY' );
}

export function yearOverviewLink() {
	return 'year-overview';
}
