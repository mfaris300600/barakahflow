import dayjs from 'dayjs/esm';
import ICAL from 'ical.js';
import PropTypes from 'prop-types';
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';
import { withTranslation } from 'react-i18next';

import { HIJRI_MONTHS, hijriMonthDayKey, hijriMonthName } from '~/lib/hijri';
import { HOLIDAY_DAY_TYPE, EVENT_DAY_TYPE } from '~/lib/special-dates-utils';

const STATUS_EMPTY = 'EMPTY';
const STATUS_LOADING = 'LOADING';
const STATUS_ERROR = 'ERROR';
const STATUS_SUCCESS = 'SUCCESS';

// Disable strict mode for ical.js to allow slightly invalid ics files.
ICAL.design.strict = false;

class SpecialDates extends React.Component {
	state = {
		hijriMonth: '1',
		hijriDay: '1',
		value: '',
		type: EVENT_DAY_TYPE,
		icalType: EVENT_DAY_TYPE,
		status: STATUS_EMPTY,
	};

	onChange = ( event ) => {
		const { field } = event.target.dataset;
		this.setState( { [ field ]: event.target.value } );
	};

	onAddClick = ( event ) => {
		const hm = Number( this.state.hijriMonth );
		const hd = Number( this.state.hijriDay );
		if ( ! hm || ! hd ) {
			return;
		}
		const key = `${String( hm ).padStart( 2, '0' )}-${String( hd ).padStart( 2, '0' )}`;
		const { value, type } = this.state;
		this.props.onAdd( { date: key, value, type } );
		this.setState( { hijriDay: '1', value: '' } );
	};

	onFileLoad = ( event ) => {
		try {
			const jcalData = ICAL.parse( event.target.result );
			const vcalendar = new ICAL.Component( jcalData );
			const vevents = vcalendar.getAllSubcomponents( 'vevent' );
			// ICS files provide Gregorian dates; convert each to its Hijri MM-DD key.
			vevents.forEach( ( vevent ) => {
				const ev = new ICAL.Event( vevent );
				const value = ev.summary;
				if ( ev.isRecurring() ) {
					const iter = ev.iterator();
					let next;
					while ( ( next = iter.next() ) ) {
						if ( next.year < this.props.year ) {
							continue;
						} else if ( next.year > this.props.year + 2 ) {
							break;
						}
						const date = dayjs( next.toJSDate() );
						const key = hijriMonthDayKey( date );
						this.props.onAdd( { date: key, value, type: this.state.icalType } );
					}
				} else {
					const startDate = dayjs( ev.startDate.toJSDate() );
					const key = hijriMonthDayKey( startDate );
					this.props.onAdd( { date: key, value, type: this.state.icalType } );
				}
			} );

			this.setState( {
				status: STATUS_SUCCESS,
			} );
		} catch ( error ) {
			this.setState( {
				status: STATUS_ERROR,
			} );
		}
	};

	onFileChange = ( event ) => {
		this.setState( {
			status: STATUS_LOADING,
		} );

		const file = event.target.files[ 0 ];
		const reader = new FileReader();
		reader.onload = this.onFileLoad;

		reader.readAsText( file );
	};

	getGroupedItems() {
		return this.props.items.reduce( ( itemsSoFar, item ) => {
			if ( ! itemsSoFar[ item.date ] ) {
				itemsSoFar[ item.date ] = [];
			}
			itemsSoFar[ item.date ].push( item );
			return itemsSoFar;
		}, {} );
	}

	renderItem( groupedItems ) {
		const ItemGroup = ( key ) => {
			const { t } = this.props;
			const items = groupedItems[ key ];
			const [ mm, dd ] = key.split( '-' ).map( Number );
			const label = `${hijriMonthName( mm )} ${dd}`;
			return (
				<ListGroup.Item key={ key }>
					<Stack direction="horizontal" gap={ 3 }>
						<b className="special-date">{label}</b>
						<ListGroup variant="flush" className="w-100">
							{items.map( ( { id, value, type }, index ) => (
								<ListGroup.Item key={ id } className="ps-0 pe-0">
									<Stack direction="horizontal" gap={ 3 }>
										<span>
											<strong>
												{t( 'configuration.special-dates.type.' + type )}:{' '}
											</strong>
											{value}
										</span>
										{this.renderRemoveButton( id )}
									</Stack>
								</ListGroup.Item>
							) )}
						</ListGroup>
					</Stack>
				</ListGroup.Item>
			);
		};
		return ItemGroup;
	}

	renderItems( groupedItems ) {
		const keys = Object.keys( groupedItems ).sort();
		return <ListGroup>{keys.map( this.renderItem( groupedItems ) )}</ListGroup>;
	}

	renderRemoveButton( id ) {
		const { onRemove, t } = this.props;
		return (
			<Button
				className="ms-auto"
				variant="outline-danger"
				onClick={ onRemove }
				data-field="specialDates"
				data-id={ id }
			>
				{t( 'configuration.special-dates.button.remove' )}
			</Button>
		);
	}

	renderStatusMessage() {
		const { t } = this.props;

		switch ( this.state.status ) {
			case STATUS_LOADING:
				return (
					<Alert variant="info" className="mt-2 mb-0">
						{t( 'configuration.special-dates.upload.loading' )}
					</Alert>
				);

			case STATUS_ERROR:
				return (
					<Alert variant="danger" className="mt-2 mb-0">
						{t( 'configuration.special-dates.upload.error' )}
					</Alert>
				);

			case STATUS_SUCCESS:
				return (
					<Alert variant="success" className="mt-2 mb-0">
						{t( 'configuration.special-dates.upload.success' )}
					</Alert>
				);

			case STATUS_EMPTY:
			default:
				return null;
		}
	}

	renderTypeSelect = ( field ) => {
		const { t, [ field ]: value } = this.props;

		return (
			<Form.Select
				className="flex-grow-0 flex-basis-fit-content"
				value={ value }
				data-field={ field }
				onChange={ this.onChange }
				aria-label="Default select example"
			>
				<option value={ EVENT_DAY_TYPE }>
					{t( 'configuration.special-dates.type.' + EVENT_DAY_TYPE )}
				</option>
				<option value={ HOLIDAY_DAY_TYPE }>
					{t( 'configuration.special-dates.type.' + HOLIDAY_DAY_TYPE )}
				</option>
			</Form.Select>
		);
	};

	render() {
		const { hijriMonth, hijriDay, value } = this.state;
		const { t } = this.props;
		const groupedItems = this.getGroupedItems();
		const numberOfItems = Object.keys( groupedItems ).length;
		return (
			<Accordion.Item eventKey="specialDates">
				<Accordion.Header>
					<Stack direction="horizontal" className="w-100">
						{t( 'configuration.special-dates.title' )}
						<Badge bg="info" className="ms-auto me-3">
							{numberOfItems}
						</Badge>
					</Stack>
				</Accordion.Header>
				<Accordion.Body>
					<p>{t( 'configuration.special-dates.description' )}</p>
					<Stack gap={ 2 }>
						{numberOfItems > 0 ? (
							this.renderItems( groupedItems )
						) : (
							<Alert variant="secondary" className="mb-0">
								{t( 'configuration.special-dates.empty' )}
							</Alert>
						)}
					</Stack>
					<Stack direction="horizontal" className="mt-3">
						<InputGroup>
							{this.renderTypeSelect( 'type' )}
							<Form.Select
								className="flex-grow-0"
								value={ hijriMonth }
								data-field="hijriMonth"
								onChange={ this.onChange }
							>
								{HIJRI_MONTHS.map( ( { name }, index ) => (
									<option key={ index } value={ index + 1 }>
										{name}
									</option>
								) )}
							</Form.Select>
							<FormControl
								className="flex-grow-0 date-field"
								value={ hijriDay }
								onChange={ this.onChange }
								type="number"
								min={ 1 }
								max={ 30 }
								data-field="hijriDay"
							/>
							<FormControl
								placeholder={ t( 'configuration.special-dates.placeholder' ) }
								value={ value }
								onChange={ this.onChange }
								data-field="value"
							/>
							<Button
								variant="outline-secondary"
								disabled={ ! hijriMonth || ! hijriDay || ! value }
								onClick={ this.onAddClick }
							>
								{t( 'configuration.special-dates.button.item' )}
							</Button>
						</InputGroup>
					</Stack>
					<Stack className="mt-3">
						<Form.Label htmlFor="icsFile">
							{t( 'configuration.special-dates.upload.label' )}
						</Form.Label>
						<Stack direction="horizontal" gap={ 2 }>
							{this.renderTypeSelect( 'icalType' )}
							<Form.Control
								id="icsFile"
								type="file"
								accept=".ics"
								onChange={ this.onFileChange }
							/>
						</Stack>
						{this.renderStatusMessage()}
					</Stack>
				</Accordion.Body>
			</Accordion.Item>
		);
	}
}

SpecialDates.propTypes = {
	year: PropTypes.number.isRequired,
	items: PropTypes.array.isRequired,
	onAdd: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'app' )( SpecialDates );
