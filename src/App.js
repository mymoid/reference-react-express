import React, {Component} from 'react';
import axios from 'axios';
import qs from 'qs';
// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';
import './App.css';

export const MYMOID_BASE = process.env.REACT_APP_API_URL;
export const REFERENCE_ID = process.env.REACT_APP_REFERENCE_ID;

axios.defaults.baseURL = MYMOID_BASE;
axios.defaults.headers.common['Accept'] = 'application/json'; // eslint-disable-line
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'; // eslint-disable-line

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static propTypes = {};

  state = {
    holderName: '',
    cardNumber: '',
    cvv: '',
    expirationDate: '',
  };

  handleChange = (name, value) => {
    this.setState({...this.state, [name]: value});
  };

  handleSubmit(event) {
    event.preventDefault();
    axios.post(`${MYMOID_BASE}/pay/reference/${REFERENCE_ID}/paymentmethod`, qs.stringify({
      ...this.state,
      alias: 'Tarjeta VISA 0004',
    })).then(response => response.data)
      .catch((error) => {
        throw error;
      });
  }

  componentDidMount() {
    axios.get(`${MYMOID_BASE}/pay/reference/${REFERENCE_ID}`).then(response => response.data)
      .catch((error) => {
        throw error;
      });
  }

  render() {
    const {
      holderName,
      cardNumber,
      cvv,
      expirationDate,
    } = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <h2>Reference</h2>
        </div>
        <p className="App-intro">
          <form onSubmit={this.handleSubmit}>
            <label>
              Holder name:
              <input
                type="text"
                value={holderName}
                onChange={
                  this.handleChange.bind(this, 'holderName')
                }
              />
            </label>
            <label>
              PAN:
              <input
                type="text"
                value={cardNumber}
                onChange={
                  this.handleChange.bind(this, 'cardNumber')
                }
              />
            </label>
            <label>
              CVV:
              <input
                type="text"
                value={cvv}
                onChange={
                  this.handleChange.bind(this, 'cvv')
                }
              />
            </label>
            <label>
              Expiration date:
              <input
                type="text"
                value={expirationDate}
                onChange={
                  this.handleChange.bind(this, 'expirationDate')
                }
              />
            </label>
            <input type="submit" value="Submit"/>
          </form>
        </p>
      </div>
    );
  }
}

export default App;
