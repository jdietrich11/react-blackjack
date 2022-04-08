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
      bank: 100,
    };

    this.handleClick = this.handleClick.bind(this);
    this.drawCard = this.drawCard.bind(this);
    this.showCard = this.showCard.bind(this);
    this.endTurn = this.endTurn.bind(this);
    this.addCard = this.addCard.bind(this);
    this.playerCounter = this.playerCounter.bind(this);
  }
  componentDidMount() {
    axios
      .get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=13')
      .then((res) => this.setState({ DeckID: res.data.deck_id }));
  }

  drawCard() {
    axios
      .get(
        `https://deckofcardsapi.com/api/deck/${this.state.DeckID}/draw/?count=1`
      )
      .then((res) => this.addCard(res.data.cards[0]));
  }

  playerCounter() {
    if (this.state.PlayerValue > 21) {
      console.log('lose');
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

  endTurn() {
    axios
      .get(
        `https://deckofcardsapi.com/api/deck/${this.state.DeckID}/draw/?count=1`
      )
      .then((res) =>
        this.setState({
          DealerHand: [...this.state.DealerHand, res.data.cards[0].code],
        })
      );
  }

  handleClick() {
    console.log(this.state.DeckID);
  }

  showCard() {
    console.log(this.state.PlayerHand);
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
              className='biding__input'
              type='number'
              value={this.state.bid}
            ></input>
          </div>
          <div className='user-inputs'>
            <button className='btn btn__draw' onClick={this.drawCard}>
              Draw
            </button>
            <button className='btn btn__end' onClick={this.endTurn}>
              End
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
