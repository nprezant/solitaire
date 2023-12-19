use log::info;
use yew::{html, Component, Context, Html, Properties};

use crate::card::Card;
use crate::dealer::Dealer;
use crate::settings::Settings;

#[derive(Debug)]
pub enum Msg {}

#[derive(Clone, Debug, PartialEq, Properties)]
pub struct Props {
    pub settings: Settings,
    #[prop_or_default]
    pub iteration: usize,
    #[prop_or_default]
    pub auto_move: usize,
}

#[derive(Debug)]
pub struct Game {
    cards: Vec<Card>,
}

impl Component for Game {
    type Message = Msg;
    type Properties = Props;

    fn create(ctx: &Context<Self>) -> Self {
        let mut cards = Card::new_deck();
        Dealer::shuffle(&mut cards);
        Dealer::deal(&mut cards, ctx.props().settings.n_columns as i32);
        Dealer::update_positions(&mut cards);

        Self { cards }
    }

    fn changed(&mut self, ctx: &Context<Self>, _old_props: &Self::Properties) -> bool {
        let props = ctx.props();
        let should_auto_move = _old_props.auto_move != props.auto_move;
        if should_auto_move {
            // do a thing
            Dealer::auto_move(&mut self.cards);
            Dealer::update_positions(&mut self.cards);
            return true;
        }
        let should_reset = _old_props.iteration != props.iteration;
        if should_reset {
            info!("Resetting for iteration {}", props.iteration);
            let settings = &props.settings;
            Dealer::shuffle(&mut self.cards);
            Dealer::deal(&mut self.cards, settings.n_columns as i32);
            Dealer::update_positions(&mut self.cards);
            true
        } else {
            false
        }
    }

    fn view(&self, _ctx: &Context<Self>) -> Html {
        html! {
            <div class="cards">
            { for self.cards.iter().map(Card::render) }
            </div>
        }
    }
}
