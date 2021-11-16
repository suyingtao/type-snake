type Empty = "🟩";
type SnakeHead = "🔴";
type SnakeBody = "🟥";
type Food = "🥚";

type Position = [number, number];
type Snake = {
  head: Position;
  body: Position[];
};
type Foods = Position[];

type NextNumber<
  N extends number,
  T extends number[] = []
> = T["length"] extends 8
  ? Error
  : T["length"] extends N
  ? [...T, 0]["length"]
  : NextNumber<N, [...T, 0]>;
type PrevNumber<
  N extends number,
  T extends number[] = []
> = T["length"] extends N
  ? T extends [any, ...infer B]
    ? B["length"]
    : Error
  : PrevNumber<N, [0, ...T]>;
type Shift<T extends any[]> = T extends [first: any, ...args: infer R] ? R : [];
type Pop<T extends any[]> = T extends [...infer A, any] ? A : [];
type UnShift<T extends any[], E> = [E, ...T];
type Push<T extends any[], I> = [...T, I];
type LastItem<T extends any[]> = T extends [...any, infer M] ? M : never;
type FirstItem<T extends any[]> = T[0] extends void ? never : T[0];

type N = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i";
type IsBody<B extends Snake["body"], P extends Position> = B["length"] extends 0
  ? false
  : B extends [P, ...any]
  ? true
  : B extends [any, ...infer C]
  ? C extends Snake["body"]
    ? IsBody<C, P>
    : never
  : never;

type RenderLine<
  Y extends number,
  S extends Snake["head"],
  B extends Snake["body"],
  F extends Position,
  X extends number = 0
> = X extends 8
  ? [X, Y] extends S
    ? SnakeHead
    : IsBody<B, [X, Y]> extends true
    ? SnakeBody
    : [X, Y] extends F
    ? Food
    : Empty
  : [X, Y] extends S
  ? `${SnakeHead}${RenderLine<Y, S, B, F, NextNumber<X>>}`
  : IsBody<B, [X, Y]> extends true
  ? `${SnakeBody}${RenderLine<Y, S, B, F, NextNumber<X>>}`
  : [X, Y] extends F
  ? `${Food}${RenderLine<Y, S, B, F, NextNumber<X>>}`
  : `${Empty}${RenderLine<Y, S, B, F, NextNumber<X>>}`;

type GetLine<k> = k extends "a"
  ? 0
  : k extends "b"
  ? 1
  : k extends "c"
  ? 2
  : k extends "d"
  ? 3
  : k extends "e"
  ? 4
  : k extends "f"
  ? 5
  : k extends "g"
  ? 6
  : k extends "h"
  ? 7
  : k extends "i"
  ? 8
  : never;

type Scene<
  Head extends Snake["head"],
  Body extends Snake["body"],
  F extends Foods
> = {
  [k in N]: RenderLine<GetLine<k>, Head, Body, F[0]>;
};

type Render<S extends Snake, F extends Foods> = Scene<S["head"], S["body"], F>;

type MoveDown<S extends Snake> = {
  head: [S["head"][0], NextNumber<S["head"][1]>];
  body: UnShift<Pop<S["body"]>, S["head"]>;
};

type MoveUp<S extends Snake> = {
  head: [S["head"][0], PrevNumber<S["head"][1]>];
  body: UnShift<Pop<S["body"]>, S["head"]>;
};

type MoveLeft<S extends Snake> = {
  head: [PrevNumber<S["head"][0]>, S["head"][1]];
  body: UnShift<Pop<S["body"]>, S["head"]>;
};

type MoveRight<S extends Snake> = {
  head: [NextNumber<S["head"][0]>, S["head"][1]];
  body: UnShift<Pop<S["body"]>, S["head"]>;
};

type Frame<S extends Snake, F extends Foods> = Render<S, F>;

type Action<A extends string, S extends Snake> = A extends "W"
  ? MoveUp<S>
  : A extends "S"
  ? MoveDown<S>
  : A extends "A"
  ? MoveLeft<S>
  : A extends "D"
  ? MoveRight<S>
  : never;

type Grow<S extends Snake, P> = P extends Position
  ? {
      head: S["head"];
      body: Push<S["body"], P>;
    }
  : never;

type Success<F extends Position, T extends Position> = F extends T
  ? true
  : false;

type StartGame<
  S extends Snake,
  F extends Foods,
  Actions extends string[] = [],
  Frames extends any[] = []
> = Actions["length"] extends 0
  ? Push<Frames, Frame<S, F>>
  : Action<FirstItem<Actions>, S> extends Snake
  ? Frames["length"] extends 0
    ? StartGame<Action<FirstItem<Actions>, S>, F, Shift<Actions>, [Frame<S, F>]>
    : Success<S["head"], FirstItem<F>> extends true
    ? StartGame<
        Grow<Action<FirstItem<Actions>, S>, LastItem<S["body"]>>,
        Shift<F>,
        Shift<Actions>,
        Push<Frames, Frame<S, F>>
      >
    : StartGame<
        Action<FirstItem<Actions>, S>,
        F,
        Shift<Actions>,
        Push<Frames, Frame<S, F>>
      >
  : never;

type DefaultFoods = [[1, 0], [5, 0], [8, 0]];
type DefaultSnake = {
  head: [0, 0];
  body: [[0, 1], [0, 2], [0, 3]];
};
type Game1 = StartGame<
  DefaultSnake,
  DefaultFoods,
  [
    "D",
    "D",
    "D",
    "D",
    "D",
    "D",
    "D",
    "D",
    "S",
    "S",
    "S",
    "S",
    "S",
    "S",
    "A",
    "A"
  ]
>;

type F1 = Game1[0];
type F2 = Game1[1];
type F3 = Game1[2];
type F4 = Game1[3];
type F5 = Game1[4];
type F6 = Game1[5];
type F7 = Game1[6];
type F8 = Game1[7];
type F9 = Game1[8];
type F10 = Game1[9];
type F11 = Game1[10];
type F12 = Game1[11];
// ...
type LastF = LastItem<Game1>;
