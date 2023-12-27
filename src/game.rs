use log::info;
use yew::{html, Component, Context, Html, Properties};

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
    dealer: Dealer,
}

impl Component for Game {
    type Message = Msg;
    type Properties = Props;

    fn create(ctx: &Context<Self>) -> Self {
        let n_columns = ctx.props().settings.n_columns;
        let draw_rate = ctx.props().settings.draw_rate;
        let mut dealer = Dealer::new(n_columns, draw_rate);
        dealer.shuffle();
        dealer.deal();
        dealer.update_positions();

        Self { dealer }
    }

    fn changed(&mut self, ctx: &Context<Self>, _old_props: &Self::Properties) -> bool {
        let props = ctx.props();
        let should_auto_move = _old_props.auto_move != props.auto_move;
        if should_auto_move {
            self.dealer.auto_move();
            self.dealer.update_positions();
            return true;
        }
        let should_reset = _old_props.iteration != props.iteration;
        if should_reset {
            info!("Resetting for iteration {}", props.iteration);
            self.dealer.set_n_columns(props.settings.n_columns);
            self.dealer.set_draw_rate(props.settings.draw_rate);
            self.dealer.shuffle();
            self.dealer.deal();
            self.dealer.update_positions();
            true
        } else {
            false
        }
    }

    fn view(&self, _ctx: &Context<Self>) -> Html {
        html! {
            <>
            { self.dealer.render() }
            </>
        }
    }
}
