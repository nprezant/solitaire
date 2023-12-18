use yew::{html, Component, Context, Html, Properties};

use crate::card::Card;
use crate::settings::Settings;

#[derive(Debug)]
pub enum Msg {}

#[derive(Clone, Debug, PartialEq, Properties)]
pub struct Props {
    pub settings: Settings,
    #[prop_or_default]
    pub iteration: usize,
}

#[derive(Debug)]
pub struct Game {
    cards: Vec<Card>,
}

impl Component for Game {
    type Message = Msg;
    type Properties = Props;

    fn create(ctx: &Context<Self>) -> Self {
        let _ = ctx;
        let cards = Card::new_deck();

        Self { cards }
    }

    fn view(&self, _ctx: &Context<Self>) -> Html {
        html! {
            <div class="cards">
            { for self.cards.iter().map(Card::render) }
            </div>
        }
    }
}
