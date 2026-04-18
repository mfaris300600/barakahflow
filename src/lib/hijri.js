import umalqura from '@umalqura/core';
import dayjs from 'dayjs/esm';

// Hijri months (1-indexed month number; arrays stored 0-indexed for convenience).
export const HIJRI_MONTHS = [
	{ name: 'Muharram', short: 'Muh', arabic: 'محرم' },
	{ name: 'Safar', short: 'Saf', arabic: 'صفر' },
	{ name: 'Rabiʿ al-Awwal', short: 'Rab I', arabic: 'ربيع الأول' },
	{ name: 'Rabiʿ al-Thani', short: 'Rab II', arabic: 'ربيع الثاني' },
	{ name: 'Jumada al-Awwal', short: 'Jum I', arabic: 'جمادى الأولى' },
	{ name: 'Jumada al-Thani', short: 'Jum II', arabic: 'جمادى الآخرة' },
	{ name: 'Rajab', short: 'Raj', arabic: 'رجب' },
	{ name: 'Shaʿban', short: 'Sha', arabic: 'شعبان' },
	{ name: 'Ramadan', short: 'Ram', arabic: 'رمضان' },
	{ name: 'Shawwal', short: 'Shw', arabic: 'شوال' },
	{ name: 'Dhu al-Qiʿdah', short: 'Dhq', arabic: 'ذو القعدة' },
	{ name: 'Dhu al-Hijjah', short: 'Dhh', arabic: 'ذو الحجة' },
];

export const MIN_HIJRI_YEAR = 1318;
export const MAX_HIJRI_YEAR = 1500;

/**
 * Convert a dayjs date to Hijri components.
 * Returns { hy, hm (1..12), hd (1..30) }.
 *
 * NOTE: @umalqura/core reads dates via local-time getters (getFullYear/etc),
 * so we keep all dayjs instances in LOCAL time — never .utc() — to avoid
 * timezone-induced off-by-one day bugs.
 */
export function hijriInfo( dayjsDate ) {
	return umalqura.$.gregorianToHijri( toJsDate( dayjsDate ) );
}

/**
 * Build a local-time dayjs instance pointing at the given Hijri date
 * (hm is 1..12). Using local time (not .utc) keeps the calendar day stable
 * under umalqura's local-time Date readers.
 *
 * NOTE: `gm` returned by `hijriToGregorian` is 0-indexed (JS Date style),
 * which dayjs' objectSupport plugin also expects — so it's passed through.
 */
export function dayjsFromHijri( hy, hm, hd = 1 ) {
	const { gy, gm, gd } = umalqura.$.hijriToGregorian( hy, hm, hd );
	return dayjs( { year: gy, month: gm, day: gd } );
}

/**
 * Days in the given Hijri month (hm is 1..12).
 */
export function daysInHijriMonth( hy, hm ) {
	return umalqura.$.getDaysInMonth( hy, hm );
}

/**
 * First day of the Hijri month that contains the given dayjs date.
 */
export function startOfHijriMonth( dayjsDate ) {
	const { hy, hm } = hijriInfo( dayjsDate );
	return dayjsFromHijri( hy, hm, 1 );
}

/**
 * Last day of the Hijri month that contains the given dayjs date.
 */
export function endOfHijriMonth( dayjsDate ) {
	const { hy, hm } = hijriInfo( dayjsDate );
	return dayjsFromHijri( hy, hm, daysInHijriMonth( hy, hm ) );
}

/**
 * Add n Hijri months to a dayjs date, preserving day of month (clamped).
 * Accepts negative n for subtraction.
 */
export function addHijriMonths( dayjsDate, n ) {
	const { hy, hm, hd } = hijriInfo( dayjsDate );
	let newHm = hm + n;
	let newHy = hy;
	while ( newHm > 12 ) {
		newHm -= 12;
		newHy += 1;
	}
	while ( newHm < 1 ) {
		newHm += 12;
		newHy -= 1;
	}
	const maxDay = daysInHijriMonth( newHy, newHm );
	return dayjsFromHijri( newHy, newHm, Math.min( hd, maxDay ) );
}

/**
 * True if a and b fall within the same Hijri month.
 */
export function isSameHijriMonth( a, b ) {
	const infoA = hijriInfo( a );
	const infoB = hijriInfo( b );
	return infoA.hy === infoB.hy && infoA.hm === infoB.hm;
}

/**
 * Short month name lookup (hm is 1..12).
 */
export function hijriMonthName( hm, variant = 'name' ) {
	return HIJRI_MONTHS[ hm - 1 ][ variant ];
}

/**
 * Long dual-date string: "12 Ramadan 1447 / 12 Mar 2026"
 */
export function formatDualDate( dayjsDate, gregorianFormat = 'DD MMM YYYY' ) {
	const { hy, hm, hd } = hijriInfo( dayjsDate );
	return `${hd} ${HIJRI_MONTHS[ hm - 1 ].name} ${hy} / ${dayjsDate.format( gregorianFormat )}`;
}

/**
 * Format the Hijri portion of a date: "12 Ramadan 1447 AH"
 */
export function formatHijriDate( dayjsDate ) {
	const { hy, hm, hd } = hijriInfo( dayjsDate );
	return `${hd} ${HIJRI_MONTHS[ hm - 1 ].name} ${hy} AH`;
}

/**
 * Hijri month label, e.g. "Ramadan 1447 AH"
 */
export function formatHijriMonth( dayjsDate ) {
	const { hy, hm } = hijriInfo( dayjsDate );
	return `${HIJRI_MONTHS[ hm - 1 ].name} ${hy} AH`;
}

/**
 * Link-safe key for a Hijri month, e.g. "09-1447"
 */
export function hijriMonthKey( dayjsDate ) {
	const { hy, hm } = hijriInfo( dayjsDate );
	return `${String( hm ).padStart( 2, '0' )}-${hy}`;
}

/**
 * Hijri "MM-DD" string for matching against special-date entries.
 */
export function hijriMonthDayKey( dayjsDate ) {
	const { hm, hd } = hijriInfo( dayjsDate );
	return `${String( hm ).padStart( 2, '0' )}-${String( hd ).padStart( 2, '0' )}`;
}

/**
 * Hijri year from a dayjs date.
 */
export function hijriYear( dayjsDate ) {
	return hijriInfo( dayjsDate ).hy;
}

/**
 * Current Hijri year (today).
 */
export function currentHijriYear() {
	return umalqura().hy;
}

/**
 * Current Hijri month number (1..12) from today's date.
 */
export function currentHijriMonth() {
	return umalqura().hm;
}

function toJsDate( input ) {
	if ( input && typeof input.toDate === 'function' ) {
		return input.toDate();
	}
	return input;
}
