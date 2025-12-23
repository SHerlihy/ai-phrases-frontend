import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ParamStore from './ParamStore';
import ParamInput from './ParamInput';

describe('ParamInput', () => {

    it('renders the component', () => {
        const { getParam, setParam } = new ParamStore()
        const key = "key"

        render(
            <ParamInput title={key} setParam={setParam} />
        )
        screen.debug();
    })

    it('sets the param', async () => {
        const { getParam, setParam } = new ParamStore()
        const title = "key"
        const param = "value"

        render(
            <ParamInput title={title} setParam={setParam} />
        )

        const user = userEvent.setup()

        const paramInput = await screen.findByRole("textbox")

        while (paramInput !== document.activeElement) {
            await user.tab()
        }

        expect(document.activeElement).toBe(paramInput)

        await user.keyboard(param)

        const savedParam = getParam(title)

        expect(savedParam).toEqual(param)
    })
})
