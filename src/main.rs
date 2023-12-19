use game::Game;
use settings::Settings;
use slider::Slider;
use yew::html::Scope;
use yew::{html, Component, Context, Html};

mod automove;
mod card;
mod dealer;
mod game;
mod layout;
mod location;
mod macros;
mod play_area;
mod rect;
mod settings;
mod slider;
mod suit;

pub enum Msg {
    ChangeSettings(Settings),
    ResetSettings,

    RestartGame,
    GiveHint,
    UndoMove,
    AutoMove,
}

pub struct App {
    settings: Settings,
    iteration: usize,
    auto_move: usize,
}
impl Component for App {
    type Message = Msg;
    type Properties = ();

    fn create(_ctx: &Context<Self>) -> Self {
        wasm_logger::init(wasm_logger::Config::default());
        Self {
            settings: Settings::load(),
            iteration: 0,
            auto_move: 0,
        }
    }

    fn update(&mut self, _ctx: &Context<Self>, msg: Msg) -> bool {
        match msg {
            Msg::ChangeSettings(settings) => {
                self.settings = settings;
                self.settings.store();
                true
            }
            Msg::ResetSettings => {
                self.settings = Settings::default();
                Settings::remove();
                true
            }
            Msg::RestartGame => {
                self.iteration = self.iteration.wrapping_add(1);
                true
            }
            Msg::GiveHint => {
                todo!();
            }
            Msg::UndoMove => {
                todo!();
            }
            Msg::AutoMove => {
                self.auto_move = self.auto_move.wrapping_add(1);
                true
            }
        }
    }

    fn view(&self, ctx: &Context<Self>) -> Html {
        let Self {
            ref settings,
            iteration,
            auto_move,
            ..
        } = *self;

        html! {
            <>
                <h1 class="title">{ "Solitaire:" }{iteration}</h1>
                <Game settings={settings.clone()} {iteration} {auto_move} />
                { self.view_panel(ctx.link()) }
            </>
        }
    }
}
impl App {
    fn view_panel(&self, link: &Scope<Self>) -> Html {
        html! {
            <div class="panel">
                { self.view_settings(link) }
                <div class="panel__buttons">
                    <button onclick={link.callback(|_| Msg::ResetSettings)}>{ "Use Defaults" }</button>
                    <button onclick={link.callback(|_| Msg::RestartGame)}>{ "Restart" }</button>
                    <button onclick={link.callback(|_| Msg::AutoMove)}>{ "Auto Move" }</button>
                </div>
            </div>
        }
    }

    fn view_settings(&self, link: &Scope<Self>) -> Html {
        let Self { settings, .. } = self;

        // This helper macro creates a callback which applies the new value to the current settings
        // and sends `Msg::ChangeSettings`. Thanks to this, we don't need to have
        // "ChangeBoids", "ChangeCohesion", etc. messages, but it comes at the cost of
        // cloning the `Settings` struct each time.
        macro_rules! settings_callback {
            ($link:expr, $settings:ident; $key:ident as $ty:ty) => {{
                let settings = $settings.clone();
                $link.callback(move |value| {
                    let mut settings = settings.clone();
                    settings.$key = value as $ty;
                    Msg::ChangeSettings(settings)
                })
            }};
            ($link:expr, $settings:ident; $key:ident) => {
                settings_callback!($link, $settings; $key as f64)
            }
        }

        html! {
            <div class="settings">
                <Slider label="Number of Columns"
                    min=2.0 max=10.0
                    onchange={settings_callback!(link, settings; n_columns as usize)}
                    value={settings.n_columns as f64}
                />
                <Slider label="Draw Rate"
                    min=1.0 max=5.0
                    onchange={settings_callback!(link, settings; draw_rate as usize)}
                    value={settings.draw_rate as f64}
                />
            </div>
        }
    }
}

fn main() {
    yew::Renderer::<App>::new().render();
}
