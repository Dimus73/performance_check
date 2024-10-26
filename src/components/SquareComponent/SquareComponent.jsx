import React, {useState} from 'react';

const ITERATIONS = 1e8;

const performHeavyComputation = (iterations) => {
    let total = 0;
    for (let i = 0; i < iterations; i++) {
        total += Math.sqrt(i);
    }
    return total;
};

const SquareComponent = (props) => {

    const [isHover, setIsHover] = useState(false)


    const result = performHeavyComputation(ITERATIONS);

    return (
        <div
            className={"data-box"}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            {props.children}
            <p>Результат вычисления: {result}</p>
            <div
                className={'data-box-fon'}
                style={isHover ? {"backgroundColor": "cyan"} : {}}
            >
            </div>
        </div>
    );
};

export default SquareComponent;