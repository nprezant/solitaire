use gloo::timers::callback::Interval;
use yew::{html, Component, Context, Html, Properties};

use crate::card::Card;
use crate::settings::Settings;

#[derive(Debug)]
pub enum Msg {
    Tick,
}

#[derive(Clone, Debug, PartialEq, Properties)]
pub struct Props {
    #[prop_or_default]
    pub settings: Settings,
}

#[derive(Debug)]
pub struct Game {
    cards: Vec<Card>,
    interval: Interval,
}

impl Component for Game {
    type Message = Msg;
    type Properties = Props;

    fn create(ctx: &Context<Self>) -> Self {
        let settings = ctx.props().settings.clone();
        let cards = Card::new_deck();

        let interval = {
            let link = ctx.link().clone();
            Interval::new(settings.tick_interval_ms as u32, move || {
                link.send_message(Msg::Tick)
            })
        };

        Self { cards, interval }
    }

    fn view(&self, _ctx: &Context<Self>) -> Html {
        html! {
            { for self.cards.iter().map(Card::render) }
        }
    }
}
