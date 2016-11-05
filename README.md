# Abstract Factory for JavaScript

Copyright (c) 2017 David Betz

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()
[![Build Status](https://travis-ci.org/davidbetz/abstractfactoryjs.svg?branch=master)](https://travis-ci.org/davidbetz/abstractfactoryjs)
[![npm version](https://badge.fury.io/js/abstractfactory.svg)](https://badge.fury.io/js/abstractfactory)
[![coverage](https://img.shields.io/codecov/c/github/davidbetz/abstractfactoryjs.svg)](https://img.shields.io/codecov/c/github/davidbetz/abstractfactoryjs.svg)
[![Say Thanks!](https://img.shields.io/badge/Say%20Thanks-!-1EAEDB.svg)](https://saythanks.io/to/davidbetz)

See test/provider.js unit test for usage.

Basically an implementation of an abstract factory pattern.

In one system where I use this, I create factories for eachs type of thing in my system. So, SearchFactory, CloudStorageFactory, QueueFactory, AristotleFactory, etc... These would implement for ID interface like ICloudStorageProvider (in Node, it's just a class).

Each of these would have their own switch/case (or whatever) to create the factory for it. So, for example, I may have config in a YAML file specifying that I want to use Mongo for my Aristotle provider ("Aristotle" is what most people incorrectly call "NoSQL").


To begin, create the factory (do this one for the entirety of your system):

    const abstractFactory = new AbstractFactory()

Then, add your factories:

        abstractFactory.set(SearchFactory)
        abstractFactory.set(CloudStorageFactory)
        abstractFactory.set(QueueFactory)
        abstractFactory.set(AristotleFactory)

When the time comes, just ask for your provider:

    provider = abstractFactory.resolve(IAristotleProvider)

Your code SHOULD. NOT. CARE. ABOUT. MONGO. It should the your configuration or something handle that. Don't tightly couple your providers.

Also note that the resolver also accepts various arguments for extra flexibility:

    provider = abstractFactory.resolve(IAristotleProvider, "alternateConnectionString", { "collection": "log" })

Despite what random bloggers say, service locators are awesome and provide excellent decoupling.

Look at the `Mock` examples provided with the tests; they're rather extensive.