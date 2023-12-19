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
}

#[derive(Debug)]
pub struct Game {
    cards: Vec<Card>,
    iteration: usize,
}

impl Component for Game {
    type Message = Msg;
    type Properties = Props;

    fn create(ctx: &Context<Self>) -> Self {
        let mut cards = Card::new_deck();
        Dealer::shuffle(&mut cards);
        Dealer::deal(&mut cards, ctx.props().settings.n_columns as i32);
        Dealer::update_positions(&mut cards);
        let iteration: usize = ctx.props().iteration;

        Self { cards, iteration }
    }

    fn changed(&mut self, ctx: &Context<Self>, _old_props: &Self::Properties) -> bool {
        let props = ctx.props();
        let should_reset = self.iteration != props.iteration;
        self.iteration = props.iteration;
        if should_reset {
            info!("Resetting for iteration {}", self.iteration);
            let settings = &props.settings;

            info!("n columns = {}", settings.n_columns);
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
