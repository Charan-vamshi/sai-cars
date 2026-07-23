import React from 'react';
import CarHero       from './car/CarHero';
import CarStats      from './car/CarStats';
import CarEngine     from './car/CarEngine';
import CarDimensions from './car/CarDimensions';
import CarFeatures   from './car/CarFeatures';
import CarNote       from './car/CarNote';
import { CARS }      from '../../data/cars';

// Sets the --car-accent CSS variable on the section element so all
// child components automatically inherit the right neon colour.
const CarPage = ({ car, sectionRef, onNext }) => {
  const nextCarObj = car.nextCar ? CARS.find((c) => c.id === car.nextCar) : null;

  return (
    <section
      id={`car-${car.id}`}
      ref={sectionRef}
      className="section car-section"
      style={{
        '--car-accent': car.accentColor,
        '--car-glow':   `${car.accentColor}88`,
      }}
    >
      {/* 1. Hero — large image + entrance animation */}
      <CarHero car={car} />

      {/* 2. Animated stat counters */}
      <CarStats stats={car.heroStats} />

      {/* 3. Engine & performance table */}
      <CarEngine engine={car.engine} />

      {/* 4. Dimensions bar chart */}
      <CarDimensions dimensions={car.dimensions} />

      {/* 5. Features grid */}
      <CarFeatures features={car.features} />

      {/* 6. Personal note + next car cue */}
      <CarNote
        note={car.note}
        nextCar={nextCarObj ? nextCarObj.name : null}
        onNext={onNext}
      />
    </section>
  );
};

export default CarPage;
