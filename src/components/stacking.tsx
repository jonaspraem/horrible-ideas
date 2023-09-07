'use client';

import { useEffect, useState } from "react";
import Matter from "matter-js"; 

const StackingGame = () => {
  const [volume, setVolume] = useState<number>(0);

  useEffect((): any => {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composites = Matter.Composites,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Composite = Matter.Composite,
        Bodies = Matter.Bodies,
        Events = Matter.Events;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create renderer
    var render = Render.create({
        element: document.getElementById("game-stacking"),
        engine: engine,
        options: {
            width: 800,
            height: 600,
            showAngleIndicator: true,
            wireframes: false
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);


    // add bodies
    var stack = Composites.stack(200, 606 - 25.25 - 5 * 40, 10, 2, 5, 5, function(x, y) {
        return Bodies.rectangle(x, y, 40, 40, {
          render: {
            fillStyle: "#0CA7C6",
            strokeStyle: 'white',
         lineWidth: 3
          }
        });
    });
    
    Composite.add(world, [
        stack,
        // walls
        Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
        Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
        Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
        Bodies.rectangle(400, 606, 800, 50.5, { isStatic: true })
    ]);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
    });

    Events.on(engine, "afterUpdate", function(){
      let heighestPosition = 100000;
      stack.bodies.map(box => {
        /* Reverted y, higher y means futher down the page */
        if (box.position.y < heighestPosition) heighestPosition = box.position.y;
      })

      setVolume(calcPercentage(heighestPosition));

    });

    function calcPercentage(x: number) {
      const highestY = 40;
      const lowestY = 580;

      const res = (x - highestY) / (lowestY - highestY);
      // flip it, because flipped y axis. Times 100 to get %
      return (1 - res) * 100;
    }

    // context for MatterTools.Demo
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function() {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
  }, []);

  return (<div>
    <h3 className="volume-heading">Volume: {Math.round(volume * 100) / 100}%</h3>
    <div id="game-stacking" />
    </div>)
}

export default StackingGame;