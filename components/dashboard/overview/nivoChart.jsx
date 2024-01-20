// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/pie
// import { ResponsivePie } from '@nivo/pie'
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const NivoChart = () => {

    let data = [
        {
            "id": "erlang",
            "label": "erlang",
            "value": 6,
            "color": "hsl(72, 70%, 50%)"
        },
        {
            "id": "python",
            "label": "python",
            "value": 348,
            "color": "hsl(43, 70%, 50%)"
        },
        {
            "id": "c",
            "label": "c",
            "value": 204,
            "color": "hsl(74, 70%, 50%)"
        },
        {
            "id": "stylus",
            "label": "stylus",
            "value": 476,
            "color": "hsl(127, 70%, 50%)"
        },
        {
            "id": "scala",
            "label": "scala",
            "value": 202,
            "color": "hsl(254, 70%, 50%)"
        }
    ]
    return (
        <>
            {/* <ResponsivePie
                data={data}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            0.2
                        ]
                    ]
                }}
                arcLinkLabelsSkipAngle={4}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsDiagonalLength={13}
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color', modifiers: [] }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            2
                        ]
                    ]
                }}
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    }
                ]}
                fill={[
                    {
                        match: {
                            id: 'ruby'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'c'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'go'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'python'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'scala'
                        },
                        id: 'lines'
                    },
                    {
                        match: {
                            id: 'lisp'
                        },
                        id: 'lines'
                    },
                    {
                        match: {
                            id: 'elixir'
                        },
                        id: 'lines'
                    },
                    {
                        match: {
                            id: 'javascript'
                        },
                        id: 'lines'
                    }
                ]}
                legends={[
                    {
                        anchor: 'top-left',
                        direction: 'column',
                        justify: false,
                        translateX: 0,
                        translateY: 0,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemsSpacing: 0,
                        symbolSize: 20,
                        itemDirection: 'left-to-right'
                    },
                    {
                        anchor: 'top-left',
                        direction: 'column',
                        justify: false,
                        translateX: 0,
                        translateY: 0,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemsSpacing: 0,
                        symbolSize: 20,
                        itemDirection: 'left-to-right'
                    },
                    {
                        anchor: 'top-left',
                        direction: 'column',
                        justify: false,
                        translateX: 0,
                        translateY: 0,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemsSpacing: 0,
                        symbolSize: 20,
                        itemDirection: 'left-to-right'
                    },
                    {
                        anchor: 'top-left',
                        direction: 'column',
                        justify: false,
                        translateX: 0,
                        translateY: 0,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemsSpacing: 0,
                        symbolSize: 20,
                        itemDirection: 'left-to-right'
                    }
                ]}
            /> */}
        </>
    )
}

export default NivoChart;