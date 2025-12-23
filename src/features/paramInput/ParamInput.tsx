import { Card, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const ParamInput = ({ title, setParam }: { title: string, setParam: (t: string, p: string) => void }) => {
    return (
        <Card className='flex flex-row justify-center align-center'>
            <CardTitle>
                <p style={{ 'lineHeight': 2 }}>{title}:</p>
            </CardTitle>
            <Input onChange={(e) => { setParam(title, e.target.value) }} />
        </Card>
    )
}

export default ParamInput
