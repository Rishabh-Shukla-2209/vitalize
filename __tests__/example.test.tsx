import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

test('Vite + React + TS', () => {
    render(<div>Hello Vitalize</div>)
    expect(screen.getByText('Hello Vitalize')).toBeInTheDocument()
})
