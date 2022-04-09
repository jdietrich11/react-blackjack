import React from 'react';
import axios from 'axios';

import './app.scss';

const logo = require('../../img/logo.png');

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      DeckID: '',
      PlayerHand: [],
      DealerHand: [],
      PlayerValue: 0,
      DealerValue: 0,
      bid: 0,
      currentBid: 0,
      bank: 100,
      active: false,
      submitted: false,
    };

    this.drawCard = this.drawCard.bind(this);
    this.endTurn = this.endTurn.bind(this);
    this.addCard = this.addCard.bind(this);
    this.playerCounter = this.playerCounter.bind(this);
    this.checkVictor = this.checkVictor.bind(this);
    this.newButton = this.newButton.bind(this);
    this.biddingChange = this.biddingChange.bind(this);
    this.biddingSubmit = this.biddingSubmit.bind(this);
    this.newRound = this.newRound.bind(this);
  }
  componentDidMount() {
    axios
      .get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=13')
      .then((res) => this.setState({ DeckID: res.data.deck_id }));
  }

  checkVictor() {
    if (
      this.state.PlayerValue > this.state.DealerValue &&
      this.state.PlayerValue < 22
    ) {
      console.log('Player Win');
      this.setState({
        bank: this.state.bank + this.state.currentBid * 2,
      });
    }
    if (
      this.state.PlayerValue < this.state.DealerValue &&
      this.state.DealerValue < 22
    ) {
      console.log('Player Lose');
    }
    if (this.state.PlayerValue > 21) {
      console.log('player loss by overshoot');
    }
  }

  drawCard() {
    if (this.state.currentBid > 0) {
      axios
        .get(
          `https://deckofcardsapi.com/api/deck/${this.state.DeckID}/draw/?count=1`
        )
        .then((res) => this.addCard(res.data.cards[0]));
    }
    if (this.state.currentBid <= 0) {
      alert('Make a positive bid');
    }
  }

  playerCounter() {
    if (this.state.PlayerValue > 21) {
      console.log('this.clearTable');
      this.setState({ active: !this.state.active });
    }
    if (this.state.PlayerValue < 22) {
      console.log('Draw again?');
    }
  }

  addCard = (props) => {
    let card = props;
    if (
      card.value === 'KING' ||
      card.value === 'QUEEN' ||
      card.value === 'JACK'
    ) {
      this.setState({
        PlayerValue: this.state.PlayerValue + 10,
        PlayerHand: [...this.state.PlayerHand, card.code],
      });
    }
    if (card.value === 'ACE') {
      this.setState({
        PlayerValue: this.state.PlayerValue + 10,
        PlayerHand: [...this.state.PlayerHand, card.code],
      });
      this.playerCounter();
    }
    if (Number.isInteger(Number(card.value))) {
      this.setState({
        PlayerValue: this.state.PlayerValue + Number(card.value),
        PlayerHand: [...this.state.PlayerHand, card.code],
      });
      this.playerCounter();
    }
  };

  dealerDraw(props) {
    let card = props;
    if (
      this.state.DealerValue < this.state.PlayerValue &&
      this.state.DealerValue < 21
    ) {
      if (
        card.value === 'KING' ||
        card.value === 'QUEEN' ||
        card.value === 'JACK'
      ) {
        this.setState({
          DealerValue: this.state.DealerValue + 10,
          DealerHand: [...this.state.DealerHand, card.code],
        });
      }
      if (card.value === 'ACE') {
        this.setState({
          DealerValue: this.state.DealerValue + 10,
          DealerHand: [...this.state.DealerHand, card.code],
        });
        this.checkVictor();
      }
      if (Number.isInteger(Number(card.value))) {
        this.setState({
          DealerValue: this.state.DealerValue + Number(card.value),
          DealerHand: [...this.state.DealerHand, card.code],
        });
        this.checkVictor();
      }
    }
  }

  async endTurn() {
    await axios
      .get(
        `https://deckofcardsapi.com/api/deck/${this.state.DeckID}/draw/?count=1`
      )
      .then((res) => this.dealerDraw(res.data.cards[0]));
    this.endTurn();
  }

  newButton() {
    console.log('WHYYYY');
    this.setState({ active: !this.state.active });
  }

  newRound() {
    this.setState({
      active: !this.state.active,
      PlayerHand: [],
      DealerHand: [],
      PlayerValue: 0,
      DealerValue: 0,
      bid: 0,
      currentBid: 0,
      submitted: false,
    });
  }

  biddingChange(e) {
    this.setState({ bid: e.target.value });
  }
  biddingSubmit(e) {
    this.setState({
      currentBid: this.state.bid,
      bank: this.state.bank - Number(this.state.bid),
      submitted: true,
    });
    console.log(this.state.bid);
  }

  render() {
    return (
      <div className='App'>
        <div className='header'>
          <div className='header__logo'>
            <img src={logo} alt='logo' className='logo' />
          </div>
          <div className='header__title'>React BlackJack</div>
          <div className='header__new-game btn'>New Game</div>
        </div>
        <div className='dealer'>
          <div className={this.state.DealerHand[0] ? 'card' : 'hidden'}>
            <div className={this.state.DealerHand[0] ? 'card' : 'hidden'}>
              <img
                className='card__img'
                src={
                  this.state.DealerHand[0]
                    ? `https://deckofcardsapi.com/static/img/${this.state.DealerHand[0]}.png`
                    : ''
                }
                alt=''
              />
            </div>
          </div>
          <div className={this.state.DealerHand[1] ? 'card' : 'hidden'}>
            <div className={this.state.DealerHand[1] ? 'card' : 'hidden'}>
              <img
                className='card__img'
                src={
                  this.state.DealerHand[1]
                    ? `https://deckofcardsapi.com/static/img/${this.state.DealerHand[1]}.png`
                    : ''
                }
                alt=''
              />
            </div>
          </div>
          <div className={this.state.DealerHand[2] ? 'card' : 'hidden'}>
            <div className={this.state.DealerHand[2] ? 'card' : 'hidden'}>
              <img
                className='card__img'
                src={
                  this.state.DealerHand[2]
                    ? `https://deckofcardsapi.com/static/img/${this.state.DealerHand[2]}.png`
                    : ''
                }
                alt=''
              />
            </div>
          </div>
          <div className={this.state.DealerHand[3] ? 'card' : 'hidden'}>
            <div className={this.state.DealerHand[3] ? 'card' : 'hidden'}>
              <img
                className='card__img'
                src={
                  this.state.DealerHand[3]
                    ? `https://deckofcardsapi.com/static/img/${this.state.DealerHand[3]}.png`
                    : ''
                }
                alt=''
              />
            </div>
          </div>
          <div className={this.state.DealerHand[4] ? 'card' : 'hidden'}>
            <div className={this.state.DealerHand[4] ? 'card' : 'hidden'}>
              <img
                className='card__img'
                src={
                  this.state.DealerHand[4]
                    ? `https://deckofcardsapi.com/static/img/${this.state.DealerHand[4]}.png`
                    : ''
                }
                alt=''
              />
            </div>
          </div>
        </div>
        <div className='playfield'>
          <div className='dealer__value'>{this.state.DealerValue}</div>
          <div className='bidding'>
            <div className='bidding__bank'>BANK: {this.state.bank}</div>
            <input
              className={this.state.submitted ? 'hidden' : 'bidding__input'}
              type='number'
              value={this.state.bid}
              onChange={this.biddingChange}
              onSubmit={this.biddingSubmit}
            ></input>
            <div
              className={this.state.submitted ? 'hidden' : 'bidding__submit'}
              onClick={this.biddingSubmit}
            >
              &#10003;
            </div>
          </div>
          <div className='user-inputs'>
            <button
              className={
                this.state.active
                  ? 'btn btn__draw btn__draw-option'
                  : 'btn btn__draw'
              }
              onClick={this.drawCard}
            >
              Draw
            </button>
            <button
              className={
                !this.state.active ? 'btn__new btn__new-option' : 'btn__new'
              }
              onClick={() => {
                this.newButton();
                this.newRound();
              }}
            >
              New Game?
            </button>
            <button
              className={
                this.state.active
                  ? 'btn btn__end btn__end-option'
                  : 'btn btn__end'
              }
              onClick={() => {
                this.endTurn();
                this.newButton();
              }}
            >
              END
            </button>
          </div>
          <div className='deck'>
            <img
              className='deck__img'
              src={require('../../img/deck.jpg')}
              alt='deck'
            />
          </div>
          <div className='player__value'>{this.state.PlayerValue}</div>
        </div>
        <div className='player'>
          <div className={this.state.PlayerHand[0] ? 'card' : 'hidden'}>
            <img
              className='card__img'
              src={
                this.state.PlayerHand[0]
                  ? `https://deckofcardsapi.com/static/img/${this.state.PlayerHand[0]}.png`
                  : ''
              }
              alt=''
            />
          </div>
          <div className={this.state.PlayerHand[1] ? 'card' : 'hidden'}>
            <img
              className='card__img'
              src={
                this.state.PlayerHand[1]
                  ? `https://deckofcardsapi.com/static/img/${this.state.PlayerHand[1]}.png`
                  : ''
              }
              alt=''
            />
          </div>
          <div className={this.state.PlayerHand[2] ? 'card' : 'hidden'}>
            <img
              className='card__img'
              src={
                this.state.PlayerHand[2]
                  ? `https://deckofcardsapi.com/static/img/${this.state.PlayerHand[2]}.png`
                  : ''
              }
              alt=''
            />
          </div>
          <div className={this.state.PlayerHand[3] ? 'card' : 'hidden'}>
            <img
              className='card__img'
              src={
                this.state.PlayerHand[3]
                  ? `https://deckofcardsapi.com/static/img/${this.state.PlayerHand[3]}.png`
                  : ''
              }
              alt=''
            />
          </div>
          <div className={this.state.PlayerHand[4] ? 'card' : 'hidden'}>
            <img
              className='card__img'
              src={
                this.state.PlayerHand[4]
                  ? `https://deckofcardsapi.com/static/img/${this.state.PlayerHand[4]}.png`
                  : ''
              }
              alt=''
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
