type Player1 = "❌";
type Player2 = "⭕️";
type Player = Player1 | Player2;
type Empty = "🟩";
type Block = Empty | Player;
type Position = [number, number];
type Size = 3;
type Push<T extends any[], I> = [...T, I];
type HasPositionInArray<A extends Position[], X extends number, Y extends number>
  = A extends [[X, Y], ...infer _]
  ? true
  : A extends [Position, ...infer Rest]
  ? Rest extends Position[]
  ? HasPositionInArray<Rest, X, Y>
  : never
  : false;

type NextNumber<
  N extends number,
  T extends number[] = []
> = T["length"] extends N
  ? [...T, 0]["length"]
  : NextNumber<N, [...T, 0]>;

type RenderLine<
  X extends number = 0,
  Y extends number = 0,
  P1 extends Position[] = [],
  P2 extends Position[] = [],
> =
  X extends Size
  ? ''
  : HasPositionInArray<P1, X, Y> extends true
  ? `${Player1}${RenderLine<NextNumber<X>, Y, P1, P2>}`
  : HasPositionInArray<P2, X, Y> extends true
  ? `${Player2}${RenderLine<NextNumber<X>, Y, P1, P2>}`
  : `${Empty}${RenderLine<NextNumber<X>, Y, P1, P2>}`;

type N = "1" | "2" | "3";
type UnionToIntersection<U> = (
  U extends unknown ? (arg: U) => 0 : never
) extends (arg: infer I) => 0
  ? I
  : never;

type LastInUnion<U> = UnionToIntersection<
  U extends unknown ? (x: U) => 0 : never
> extends (x: infer L) => 0
  ? L
  : never;

type UnionToTuple<U, Last = LastInUnion<U>> = [U] extends [never]
  ? []
  : [...UnionToTuple<Exclude<U, Last>>, Last];

type NArr = UnionToTuple<N>;

type GetLine<k> = k extends "1"
  ? 0
  : k extends "2"
  ? 1
  : k extends "3"
  ? 2
  : never;
type GetKey<k> = k extends 0 ? '1' : k extends 1 ? '2' : k extends 2 ? '3' : never;
type RenderGame<
  P1 extends Position[] = [],
  P2 extends Position[] = [],
> = {
    [k in N]: RenderLine<0, GetLine<k>, P1, P2>
  }
type Scene1 = RenderGame<[[1, 1], [0, 0]], [[2, 1]]>
//   ^?

type GreaterArr<
  N extends number,
  T extends unknown[] = []
> = T["length"] extends N ? T : GreaterArr<N, [...T, unknown]>;

type GreaterThan<A extends number, B extends number> = GreaterArr<B> extends [
  ...GreaterArr<A>,
  ...infer _
]
  ? false
  : true;


type Unshift<T extends any[]> = T extends [any, ...infer A] ? A : [];

type GameStr<Game extends Record<N, string>, K extends N[] = NArr, Key = K[0]> = Key extends N ? `${Game[Key]}${GameStr<Game, Unshift<K>>}` : '';

type B = GameStr<Scene1>;
//   ^?

type UnshiftStr<S extends String> = S extends `${any}${infer _}` ? _ : ''


type GetPlayerCount<
  Game extends Record<N, string>,
  T extends Player,
  Str extends string = GameStr<Game>,
  Count extends number = 0
> = Str extends '' ? Count : Str extends `${Block}${infer S}` ? GetPlayerCount<Game, T, S, Str extends `${T}${infer _}` ? NextNumber<Count> : Count> : Count;

// 获取下一个 Player
// - 获取 Player1 数量
// - 获取 Player2 数量
// - 如果 Player1 > Player2 返回 Player2，否则返回 Player1
type GetNextPlayer<G extends Record<N, string>> = GreaterThan<GetPlayerCount<G, Player1>, GetPlayerCount<G, Player2>> extends true ? Player2 : Player1;

type Actions<
  PArr extends Position[],
  P1 extends Position[] = [],
  P2 extends Position[] = [],
  CurrGame extends Record<N, string> = RenderGame<P1, P2>
> = PArr['length'] extends 0
  ? RenderGame<P1, P2>
  : PArr extends [infer T, ...infer A]
  ? T extends Position
  ? A extends Position[]
  ? GetNextPlayer<CurrGame> extends Player1 ? Actions<A, [...P1, T], P2, RenderGame<[...P1, T], P2>> : Actions<A, P1, [...P2, T], RenderGame<P1, [...P2, T]>>
  : CurrGame
  : CurrGame
  : CurrGame;

type Game = Actions<[[1, 1], [2, 2], [1, 2], [2, 1], [1, 0]]>
