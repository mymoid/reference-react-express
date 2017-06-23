import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import queryString from 'query-string';
import './App.css';

export const MYMOID_BASE = process.env.REACT_APP_API_URL;

axios.defaults.baseURL = MYMOID_BASE;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Authorization'] = process.env.REACT_APP_CREDENTIALS;

class App extends Component {
  constructor(props) {
    super(props)
    const parsed = queryString.parse(window.location.search);
    this.state = {
      ...parsed,
    }
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div className="App-header">
            <h2>Reference</h2>
          </div>
          <Route path="/"
                 render={({match}) => (
                   <ReferenceForm
                     referenceId={this.state.referenceId}
                     actionUrl={this.state.actionUrl}
                     paymentOrderId={this.state.paymentOrderId}
                   />
                 )}/>
        </div>
      </Router>
    );
  }
}

const inputStyle = {
  flex: '1',
};

class ReferenceForm extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static propTypes = {
    referenceId: PropTypes.string,
    actionUrl: PropTypes.string,
    paymentOrderId: PropTypes.string,
  };

  state = {
    holderName: 'Luis Gutierrez',
    cardNumber: '4548812049400004',
    cvv: '123',
    expirationDate: '2020-12-17',
  };

  infoStyle = {
    marginTop: '30px',
    width: '100%',
    display: 'flex',
    textAlign: 'center',
  };

  requestErrorStyle = Object.assign({}, this.infoStyle, {color: 'red'});

  addPaymentMethod = () => {
    const {
      holderName,
      cardNumber,
      cvv,
      expirationDate,
    } = this.state;

    return axios.post(`${MYMOID_BASE}/pay/reference/${this.props.referenceId}/paymentmethod`, {
      alias: 'Tarjeta VISA 0004',
      cardNumber,
      cvv,
      defaultPaymentMethod: false,
      error: undefined,
      expirationDate,
      holderName,
    });
  };

  checkOrder = () => axios.get(`${MYMOID_BASE}/pay/order/${this.props.paymentOrderId}`);

  fetchReference = () => axios.get(`${MYMOID_BASE}/pay/reference/${this.props.referenceId}`);

  handleChange = (name, event) => {
    this.setState({...this.state, [name]: event.target.value});
  };

  handleSubmit = async (event) => {
    const {
      actionUrl,
    } = this.props;
    event.preventDefault();

    try {
      const response = await this.addPaymentMethod();
      this.setState({
        ...response.data.data
      });
      actionUrl ? window.location.href =
        `${actionUrl}/?referenceId=${this.props.referenceId}&paymentOrderId=${this.props.paymentOrderId}` : null;
    } catch (error) {
      this.setState({error: error.message});
    }
  };

  renderInfo = () => {
    const {
      amount,
      concept,
      paymentMethodId,
      paymentOrderId,
      referenceId,
    } = this.state;

    return paymentOrderId ?
      <section>
        <span style={this.infoStyle}>concept: {concept}</span>
        <span style={this.infoStyle}>amount: {amount}</span>
        <span style={this.infoStyle}>paymentOrderId: {paymentOrderId}</span>
      </section> :
      <section>
        <span style={this.infoStyle}>referenceId: {referenceId}</span>
        <span style={this.infoStyle}>paymentMethodId: {paymentMethodId}</span>
      </section>
  };

  componentDidMount() {
    const {
      paymentOrderId,
    } = this.props;
    if (paymentOrderId) {
      this.checkOrder()
        .then(response => {
          this.setState({...response.data.data})
        })
        .catch((error) => {
          throw error;
        });
    } else {
      this.fetchReference()
        .then(response => {
          this.setState({...response.data.data})
        })
        .catch((error) => {
          throw error;
        });
    }
  }

  render() {
    const {
      cardNumber,
      cvv,
      expirationDate,
      error,
      holderName,
    } = this.state;

    return (
      <p className="App-intro">
        <form onSubmit={this.handleSubmit} style={{display: 'flex', padding: '3em'}}>
          <label style={inputStyle}>
            Holder name:
            <input
              type="text"
              value={holderName}
              onChange={
                this.handleChange.bind(this, 'holderName')
              }
            />
          </label>
          <label style={inputStyle}>
            PAN:
            <input
              type="text"
              value={cardNumber}
              onChange={
                this.handleChange.bind(this, 'cardNumber')
              }
            />
          </label>
          <label style={inputStyle}>
            CVV:
            <input
              type="text"
              value={cvv}
              onChange={
                this.handleChange.bind(this, 'cvv')
              }
            />
          </label>
          <label style={inputStyle}>
            Expiration date:
            <input
              type="text"
              value={expirationDate}
              onChange={
                this.handleChange.bind(this, 'expirationDate')
              }
            />
          </label>
          <input style={inputStyle} type="submit" value="Submit"/>
        </form>
        {
          !error ?
            this.renderInfo() :
            <span style={this.requestErrorStyle}>{error}</span>
        }
      </p>
    )
  }
}

export default App;
