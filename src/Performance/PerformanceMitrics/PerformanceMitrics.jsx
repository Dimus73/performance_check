import { useEffect, useRef } from 'react';

const PRINT_LOGS_TO_CONSOLE = true;
const START_TIME_FOR_LONG_RENDERING_TASK = 50;
const WAIT_LOOP_LENGTH = 3000;


const PerformanceMetrics = () => {
    const popRefTimer = useRef(0);
    const currentTimer = useRef();
    const currentLastEventEnd = useRef(0);
    const performanceId = useRef();
    const refWriteLogEnable = useRef(true);

    const performanceInterval = () => {
        const performanceTimingInterval = setInterval(()=>{
            const timing = window.performance.timing;
            if (timing.loadEventEnd === 0)
                console.log('@@ Page not ready eat');
            else
                console.log('@@ Page load time => ', timing.loadEventEnd - timing.navigationStart);
        }, 50);

        setTimeout(()=> {
            clearInterval(performanceTimingInterval);
            console.log('@@ Stop INTERVAL')
        }, 20000)
    }

    useEffect(() => {
        const checkTimeToInteractive = () => {

            if (performance.now() - currentLastEventEnd.current >= WAIT_LOOP_LENGTH) {
                sendData(currentLastEventEnd.current);
            } else {
                currentTimer.current = setTimeout(checkTimeToInteractive, WAIT_LOOP_LENGTH);
            }
        };

        const performanceObserver = new window.PerformanceObserver(entryList => {
            const currentLongTaskEvent = [];
            const entries = entryList.getEntries();

            entries.forEach((entry) => {
                if (entry.entryType === 'longtask' && entry.duration > START_TIME_FOR_LONG_RENDERING_TASK) {
                    currentLongTaskEvent.push(entry);
                }
            });
            const lastEvent = currentLongTaskEvent[currentLongTaskEvent.length - 1];
            if (lastEvent) {
                currentLastEventEnd.current = lastEvent ? lastEvent.startTime + lastEvent.duration : 0;
                if (currentTimer.current) {
                    clearTimeout(currentTimer.current);
                }
                if (PRINT_LOGS_TO_CONSOLE) console.log("*^* !! In Observer currentLastEventEnd=>", currentLastEventEnd.current);
                checkTimeToInteractive();
            }
        });

        performanceObserver.observe({ entryTypes: ['longtask', 'paint'] });

        // ************ Timer Interval *********************
        // Use only browser API (not work with react app)
        // performanceInterval();
        // ************ Timer Interval *********************

        return () => {
            if (PRINT_LOGS_TO_CONSOLE) console.log("!!!! --- Unmount PerformanceMetrics.tsx");
            performanceObserver.disconnect();
            clearTimeout(currentTimer.current);
        };
    }, []);

    const sendData = (lastEventEnd) => {

        if (refWriteLogEnable.current) {
            const BasePerformanceInfo = {
                performanceId: performanceId.current,
                href: window.location.href,
                tti: lastEventEnd - popRefTimer.current,
                lastEventEnd,
                popRefTimer: popRefTimer.current,
                component_name: '',
            };

            if (PRINT_LOGS_TO_CONSOLE) console.log('*^* !! Result data =>', BasePerformanceInfo);
        }
    };

    return null;
};

export default PerformanceMetrics;
