// MIT License

// Copyright (c) 2017 David Betz

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const u = require('../utility')

const AbstractFactory = require('../abstract-factory')
const IProvider = require('../provider')
const optionsParser = require('../options-parser')

class IMockProvider extends IProvider {
}

class BadMockProvider extends IMockProvider {
    execute_spelled_wrong() {
    }
}

class CoreMockProvider extends IMockProvider {
    execute() {
        let [args, options] = optionsParser(arguments)
        let arg = this.getArg(0, args)
        return `${arg}mock provider`
    }
}

class NoOptionsMockProvider extends IMockProvider {
    execute() {
        let arg = this.getArg(0)
        return `no options${arg} mock provider`
    }
}

class MockAlternativeProvider extends IMockProvider {
    constructor(options) {
        super()
        this.init_options = options || {}
    }

    execute() {
        let [args, options] = optionsParser(arguments)

        let arg = this.getArg(0, args)
        let taco = this.getOption('taco', this.init_options)
        let burrito = this.getOption('burrito', ...options)
        let result = `${arg}${taco}alternative mock provider${burrito}`
        return result
    }
}

class MockProviderFactory {
    constructor() {
        this._interface_type = new IMockProvider().constructor.name
    }

    get interface_type() {
        return this._interface_type
    }

    create() {
        let [args, options] = optionsParser(Object.keys(arguments).map(p => arguments[p]).slice(0))

        let hint
        if (args.length > 0) {
            hint = args[0]
        }

        let example_provider_to_use_from_config_store = "mock"

        let name = (hint || example_provider_to_use_from_config_store || '').toLowerCase()

        if (typeof name === 'undefined' || name.length === 0)
            return undefined

        let provider

        if (name == "mock") {
            provider = new CoreMockProvider()
        }
        else if (name == "alt") {
            provider = new MockAlternativeProvider(...options)
        }
        else if (name == "nooptions") {
            provider = new NoOptionsMockProvider()
        }
        else if (name == "bad") {
            provider = new BadMockProvider()
        }
        else {
            throw new Error("Invalid provider")
        }

        return provider
    }
}

const IZProvider = class extends IProvider { }
const ProviderA = class extends IZProvider {
    execute() {
        return `a provider`
    }
}

class ZProviderFactory {
    constructor() {
        this._interface_type = new IZProvider().constructor.name
    }

    get interface_type() {
        return this._interface_type
    }

    create() {
        let [args, options] = optionsParser(Object.keys(arguments).map(p => arguments[p]).slice(0))

        let hint
        if (args.length > 0) {
            hint = args[0]
        }

        let example_provider_to_use_from_config_store = "a"

        let name = (hint || example_provider_to_use_from_config_store || '').toLowerCase()

        if (typeof name === 'undefined' || name.length === 0)
            return undefined

        let provider

        if (name == "a") {
            provider = new ProviderA()
        }
        else {
            throw new Error("Invalid provider")
        }

        return provider
    }
}

module.exports = { IMockProvider, BadMockProvider, CoreMockProvider, MockAlternativeProvider, MockProviderFactory, ZProviderFactory, IZProvider }