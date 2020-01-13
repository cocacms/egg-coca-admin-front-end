import React, { Component } from 'react';
import { TimePicker } from 'antd';
import moment from 'moment';

class TimeRange extends Component {
  state = {
    value: [],
    error: false,
  };

  componentDidMount() {
    this.setState({
      value: this.props.value || [],
    });
  }

  onChange = (index, time, timeString) => {
    if (time === null) {
      this.props.onChange(null);
      const value = [...this.state.value];
      value[index] = null;
      this.setState({
        value,
        error: false,
      });
      return;
    }

    const { format = 'HH:mm:ss' } = this.props;

    if (index === 0) {
      this.setState(
        {
          value: [timeString],
        },
        this.toChange,
      );
    }

    if (index === 1 && this.state.value.length >= 1) {
      const before = moment(this.state.value[0], format);

      if (time.isAfter(before)) {
        this.setState(
          {
            value: [this.state.value[0], timeString],
            error: false,
          },
          this.toChange,
        );
      } else {
        this.setState({
          error: true,
        });
      }
    }
  };

  toChange = () => {
    if (typeof this.props.onChange !== 'function') return;
    if (this.state.value.length === 2) {
      this.props.onChange(this.state.value);
    }
  };

  render() {
    const { format = 'HH:mm:ss', minuteStep = 1 } = this.props;
    return (
      <div>
        <TimePicker
          format={format}
          minuteStep={minuteStep}
          onChange={this.onChange.bind(this, 0)}
          value={this.state.value[0] ? moment(this.state.value[0], format) : null}
        />
        &nbsp;~&nbsp;
        <TimePicker
          format={format}
          minuteStep={minuteStep}
          onChange={this.onChange.bind(this, 1)}
          value={this.state.value[1] ? moment(this.state.value[1], format) : null}
        />
        {this.state.error && (
          <p style={{ marginBottom: 8, lineHeight: '20px', color: 'red' }}>
            结束时间必须大于开始时间
          </p>
        )}
      </div>
    );
  }
}

export default TimeRange;
