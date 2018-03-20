import React from "react";
import PropTypes from "prop-types";

import {
  composeEventHandlers,
  requiredProp,
  unwrapChildrenForPreact,
  subtractMonth,
  addMonth,
  isBackDisabled,
  isForwardDisabled,
  getCalendars
} from "./utils";

class Dayzed extends React.Component {
  state = { offset: 0 };

  /*------------------------- React Component Lifecycle Methods ---*/

  render() {
    const { children, render = children, firstDayOfWeek, ...otherProps } = this.props;

    const calendars = getCalendars({
      ...otherProps,
      firstDayOfWeek,
      offset: this.getOffset()
    });

    const props = {
      calendars,
      firstDayOfWeek,
      getDateProps: this.getDateProps,
      getBackProps: this.getBackProps,
      getForwardProps: this.getForwardProps
    };

    return unwrapChildrenForPreact(render)(props);
  }

  /*------------------------- Prop Getters ---*/

  getBackProps = ({
    onClick,
    offset = 1,
    calendars = requiredProp("getBackProps", "calendars"),
    ...rest
  } = {}) => {
    let { minDate } = this.props;
    let offsetMonth = this.getOffset();
    return {
      onClick: composeEventHandlers(onClick, () => {
        this.onOffsetChanged(
          offsetMonth - subtractMonth({ calendars, offset, minDate })
        );
      }),
      disabled: isBackDisabled({ calendars, offset, minDate }),
      "aria-label": `Go back ${offset} month${offset === 1 ? "" : "s"}`,
      ...rest
    };
  };

  getForwardProps = ({
    onClick,
    offset = 1,
    calendars = requiredProp("getForwardProps", "calendars"),
    ...rest
  } = {}) => {
    let { maxDate } = this.props;
    let offsetMonth = this.getOffset();
    return {
      onClick: composeEventHandlers(onClick, () => {
        this.onOffsetChanged(
          offsetMonth + addMonth({ calendars, offset, maxDate })
        );
      }),
      disabled: isForwardDisabled({ calendars, offset, maxDate }),
      "aria-label": `Go forward ${offset} month${offset === 1 ? "" : "s"}`,
      ...rest
    };
  };

  getDateProps = ({
    onClick,
    dateObj = requiredProp("getDateProps", "dateObj"),
    ...rest
  } = {}) => {
    return {
      onClick: composeEventHandlers(onClick, () => {
        this.props.onDateSelected(dateObj);
      }),
      disabled: !dateObj.selectable,
      "aria-label": dateObj.date.toDateString(),
      "aria-pressed": dateObj.selected,
      role: "button",
      ...rest
    };
  };

  /*------------------------- Control Props ---*/

  getOffset = () => {
    return this.isOffsetControlled() ? this.props.offset : this.state.offset;
  };

  isOffsetControlled = () => {
    return this.props.offset !== undefined;
  };

  onOffsetChanged = newOffset => {
    if (this.isOffsetControlled()) {
      this.props.onOffsetChanged(newOffset);
    } else {
      this.setState({ offset: newOffset }, () => {
        this.props.onOffsetChanged(newOffset);
      });
    }
  };
}
function noop() {}

Dayzed.defaultProps = {
  date: new Date(),
  monthsToDisplay: 1,
  onOffsetChanged: noop,
  children: noop,
  firstDayOfWeek: 0,
};

Dayzed.propTypes = {
  render: PropTypes.func,
  children: PropTypes.func,
  date: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  monthsToDisplay: PropTypes.number,
  offset: PropTypes.number,
  onDateSelected: PropTypes.func.isRequired,
  onOffsetChanged: PropTypes.func,
  selected: PropTypes.oneOfType([
    PropTypes.arrayOf(Date),
    PropTypes.instanceOf(Date)
  ]),
  firstDayOfWeek:PropTypes.number,
};

export default Dayzed;
