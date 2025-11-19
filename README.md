# HQTSM: Class

Class utilities for strongly typed classes

![class](https://img.shields.io/badge/class-eee)
![constant](https://img.shields.io/badge/constant-eee)
![types](https://img.shields.io/badge/types-eee)
![readonly](https://img.shields.io/badge/readonly-eee)

[![JSR](https://jsr.io/badges/@hqtsm/class)](https://jsr.io/@hqtsm/class)
[![npm](https://img.shields.io/npm/v/@hqtsm/class.svg)](https://npmjs.com/package/@hqtsm/class)
[![CI](https://github.com/hqtsm/class/actions/workflows/ci.yaml/badge.svg)](https://github.com/hqtsm/class/actions/workflows/ci.yaml)

# Features

- Pure TypeScript, run anywhere
- Utility types and functions for classes
- Strong static type checking
- Tree shaking friendly design

# Usage

## `Abstract`

Create an abstract class type from concrete base.

```ts
import type { Abstract } from '@hqtsm/class';

class Foo {
	public add = 0;
	public num: number;
	constructor(num: number) {
		this.num = num;
	}
	public total(): number {
		return this.num + this.add;
	}
}

abstract class Bar extends Foo {
	public override add = 1;
}

abstract class Baz extends Foo {
	public override add = 2;
}

function total(C: Abstract<typeof Foo>, value: number) {
	return new (class extends C {})(value).total();
}

console.assert(total(Foo, 40) === 40);
console.assert(total(Bar, 40) === 41);
console.assert(total(Baz, 40) === 42);
```

## `Concrete`

Create a concrete class from an abstract base.

```ts
import type { Concrete } from '@hqtsm/class';

abstract class Foo {
	public abstract add: number;
	public num: number;
	constructor(num: number) {
		this.num = num;
	}
	public total(): number {
		return this.num + this.add;
	}
}

class Bar extends Foo {
	public override add = 1;
}

class Baz extends Foo {
	public override add = 2;
}

function total(C: Concrete<typeof Foo>, value: number) {
	return new C(value).total();
}

console.assert(total(Bar, 40) === 41);
console.assert(total(Baz, 40) === 42);
```

## `Class`

Declaring constructor type for type-safe child statics (late static binding).

```ts
import type { Class } from '@hqtsm/class';

abstract class Foo {
	declare public readonly ['constructor']: Class<typeof Foo>;
	public num: number;
	constructor(num: number) {
		this.num = num;
	}
	public total(): number {
		return this.num + this.constructor.ADD;
	}
	public static readonly ADD: number = 0;
}

class Bar extends Foo {
	public static override readonly ADD = 1;
}

class Baz extends Foo {
	public static override readonly ADD = 2;
}

console.assert(new Bar(40).total() === 41);
console.assert(new Baz(40).total() === 42);
```

## `IsClass`

Assert argument is a class of certain properties, even if constructor is not accessible.

```ts
import type { IsClass } from '@hqtsm/class';

class Foo {
	protected constructor() {}
	public static readonly MAGIC = 1;
}

class Bar {
	private constructor() {}
	public static readonly MAGIC = 2;
}

function magic<T>(C: T & IsClass<T, { readonly MAGIC: number }>) {
	return C.MAGIC;
}

console.assert(magic(Foo) === 1);
console.assert(magic(Bar) === 2);
```

## `ReadonlyKeys`

Get readonly keys from a type.

```ts
import type { ReadonlyKeys } from '@hqtsm/class';

type Mixed = {
	a: number;
	readonly b: number;
	readonly c?: number;
};

type MixedKeysRO = ReadonlyKeys<Mixed>; // 'b' | 'c'
```

## `constant`

Define constant properties like native constants.

```ts
import { constant } from '@hqtsm/class';

class Constants {
	public static readonly FOO = 1;
	protected static readonly BAR = 2;
	private static readonly BAZ = 3;

	static {
		constant(this, 'FOO');

		// TypeScript limitation...
		constant(this, 'BAR' as never);
		constant(this, 'BAZ' as never);
	}
}

const desc = Object.getOwnPropertyDescriptor(Constants, 'FOO')!;
console.assert(desc.value === 1);
console.assert(desc.writable === false);
console.assert(desc.enumerable === false);
console.assert(desc.configurable === false);
```

## `toStringTag`

Define `Symbol.toStringTag` on a class like native types.

```ts
import { toStringTag } from '@hqtsm/class';

class Foo {
	static {
		toStringTag(this, 'Foo');
	}
}

class Bar {
	static {
		toStringTag(this, 'Bar');
	}
}

console.assert(String(new Foo()) === '[object Foo]');
console.assert(String(new Bar()) === '[object Bar]');
```
