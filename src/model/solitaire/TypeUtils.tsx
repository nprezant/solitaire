
// Picks the members of a type
// https://stackoverflow.com/questions/49061774/how-to-build-a-typescript-class-constructor-with-object-defining-class-fields
type NonMethodKeys<T> = {[P in keyof T]: T[P] extends Function ? never : P }[keyof T];  
export type MembersOf<T> = Pick<T, NonMethodKeys<T>>;

// A tweenconfig but without any required members
export type TweenConfig = Omit<Phaser.Types.Tweens.TweenBuilderConfig, 'target'>;
