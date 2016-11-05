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

"use strict"

const expect = require('chai').expect
const assert = require('chai').assert

const AbstractFactory = require('../abstract-factory')

const $mock = require('./mock')
const MockProviderFactory = $mock.MockProviderFactory
const IMockProvider = $mock.IMockProvider

describe("provider", function () {
    it("tests bad", function () {
        const abstractFactory = new AbstractFactory()
        abstractFactory.set(MockProviderFactory)

        const provider = abstractFactory.resolve(IMockProvider, "bad")
        try {
            let result = provider.execute("nope")
            expect(1).to.eq(0)
        }
        catch (ex) {
            expect(ex.message).to.eq('Execute is not implemented')
        }
    })

    it("tests does_not_exist", function () {
        const abstractFactory = new AbstractFactory()
        abstractFactory.set(MockProviderFactory)

        try {
            const provider = abstractFactory.resolve(IMockProvider, "does not exist")
            expect(1).to.eq(0)
        }
        catch (ex) {
            expect(ex.message).to.eq('Invalid provider')
        }
    })

    it("tests set invalid factory", function () {
        const abstractFactory = new AbstractFactory()

        try {
            abstractFactory.set(class { constructor() { } })
            expect(1).to.eq(0)
        }
        catch (ex) {
            expect(ex.message).to.eq('Factory requires provider/interface type')
        }
    })

    it("tests add, run, and remove", function () {
        const abstractFactory = new AbstractFactory()
        abstractFactory.set(MockProviderFactory)

        const provider = abstractFactory.resolve(IMockProvider)
        let result = provider.execute()
        expect(result).to.eq("mock provider")

        expect(Object.keys(abstractFactory.factories).length).to.eq(1)

        abstractFactory.remove(MockProviderFactory)

        expect(Object.keys(abstractFactory.factories).length).to.eq(0)
    })

    it("tests resolves with no factory", function () {
        const abstractFactory = new AbstractFactory()

        try {
            const provider = abstractFactory.resolve(IMockProvider)
            expect(1).to.eq(0)
        }
        catch (ex) {
            expect(ex.message).to.eq('Factory not registered')
        }
    })

    it("tests add multiple", function () {
        const abstractFactory = new AbstractFactory()
        abstractFactory.set(MockProviderFactory)
        abstractFactory.set($mock.ZProviderFactory)

        const provider1 = abstractFactory.resolve(IMockProvider)
        let result1 = provider1.execute()
        expect(result1).to.eq("mock provider")

        const provider2 = abstractFactory.resolve($mock.IZProvider)
        let result2 = provider2.execute()
        expect(result2).to.eq("a provider")
    })

    it("tests execute no options mock provider", function () {
        const abstractFactory = new AbstractFactory()
        abstractFactory.set(MockProviderFactory)

        const provider = abstractFactory.resolve(IMockProvider, 'nooptions')
        let result = provider.execute()

        expect(result).to.eq("no options mock provider")
    })

    it("tests execute_no_parameter", function () {
        const abstractFactory = new AbstractFactory()
        abstractFactory.set(MockProviderFactory)

        const provider = abstractFactory.resolve(IMockProvider)
        let result = provider.execute()

        expect(result).to.eq("mock provider")
    })

    it("tests execute_with_parameter", function () {
        const abstractFactory = new AbstractFactory()
        abstractFactory.set(MockProviderFactory)

        const provider = abstractFactory.resolve(IMockProvider)
        let result = provider.execute("hello")

        expect(result).to.eq("hellomock provider")
    })

    it("tests with_override_without_parameter", function () {
        const abstractFactory = new AbstractFactory()
        abstractFactory.set(MockProviderFactory)

        const provider = abstractFactory.resolve(IMockProvider, "alt")
        let result = provider.execute()

        expect(result).to.eq("alternative mock provider")
    })

    it("tests with_override_and_parameter", function () {
        const abstractFactory = new AbstractFactory()
        abstractFactory.set(MockProviderFactory)

        const provider = abstractFactory.resolve(IMockProvider, "alt")
        let result = provider.execute("hi")

        expect(result).to.eq("hialternative mock provider")
    })

    it("tests with_override_and_options", function () {
        const abstractFactory = new AbstractFactory()
        abstractFactory.set(MockProviderFactory)

        const provider = abstractFactory.resolve(IMockProvider, "alt", { taco: "keyword param" })
        let result = provider.execute("hi")

        expect(result).to.eq("hikeyword paramalternative mock provider")
    })

    it("tests with_override_and_options_and_paramoptions", function () {
        const abstractFactory = new AbstractFactory()
        abstractFactory.set(MockProviderFactory)

        const provider = abstractFactory.resolve(IMockProvider, "alt", { taco: "keyword param" })
        let result = provider.execute("hi", { burrito: "parameter keyword param" })

        expect(result).to.eq("hikeyword paramalternative mock providerparameter keyword param")
    })
})