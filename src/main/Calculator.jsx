import React, { Component } from 'react'
import './Calculator.css'
import Button from '../components/Button'
import Display from '../components/Display'

const initialState = {
    displayValue: '0',
    clearDisplay: false,
    operation: null,
    values: [0, 0],
    current: 0
}

export default class Calculator extends Component {

    state = {
        ...initialState
    }

    clearMemory = () => {
        this.setState({ ...initialState })
    }

    addDigit(value) {
        if (value === '.' && this.state.displayValue.includes('.')) {
            return
        }

        const clearDisplay = this.state.displayValue === '0' || this.state.clearDisplay
        const currentValue = clearDisplay ? '' : this.state.displayValue
        const displayValue = currentValue + value

        this.setState({
            displayValue, clearDisplay: false
        })

        if (value !== '.') {
            const i = this.state.current
            const newValue = parseFloat(displayValue)
            const values = [...this.state.values]
            values[i] = newValue

            this.setState({ values })

        }
    }

    setOperation(operation) {
        if (this.state.current === 0) {
            this.setState({
                operation, current: 1, clearDisplay: true
            })
        } else {
            const equals = operation === '='
            const currentOperation = this.state.operation
            const values = [...this.state.values]
            try {
                values[0] = eval(`${values[0]} ${currentOperation} ${values[1]}`)
            } catch (error) {
                values[0] = this.state.values[0]
            }
            values[1] = 0

            this.setState({
                displayValue: values[0],
                operation: equals ? null : operation,
                current: equals ? 0 : 1,
                clearDisplay: !equals,
                values
            })
        }
    }

    setFunction(func, value = null) {
        switch (func) {
            case 'add':
                this.addDigit(value)
                break
            case 'set':
                this.setOperation(value)
                break
            default:
                this.clearMemory()
                break
        }
    }

    render() {

        const setFunction = (func, value) => this.setFunction(func, value)

        const buttonLabels = [
            'AC', '/',
            '7', '8', '9',
            '*',
            '4', '5', '6',
            '-',
            '1', '2', '3',
            '+',
            '0', '.',
            '='
        ]

        return (
            <div className="calculator">
                <Display value={this.state.displayValue} />
                {buttonLabels.map(label => {
                    if (label === 'AC') {
                        return <Button
                            key={label}
                            click={() => setFunction('default')}
                            label={label}
                            triple
                        />
                    }

                    if ((!isNaN(label) && label !== 'AC') || label === '.') {
                        return <Button
                            key={label}
                            click={() => setFunction('add', label)}
                            label={label}
                            double={label === '0' ? true : false}
                        />
                    }

                    return <Button
                        key={label}
                        click={() => setFunction('set', label)}
                        label={label}
                        operation
                    />
                }
                )}
            </div>
        )
    }
}