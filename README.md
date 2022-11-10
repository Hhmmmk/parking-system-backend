# Parking Slot Allotment System

### Parking Slot Allotment System [Lemondrop Technologies: Final Project]

#### Problem: 

You were hired by XYZ Corp. to implement a parking allocation system for their new malling complex, the Object-Oriented Mall.
The new parking system will pre-assign a slot for every vehicle coming into the complex. No vehicle can freely choose a parking
slot and no vehicle is reserved or assigned a slot until they arrive at the entry point of the complex. The system must assign
a parking slot the satisfies the following constraints:

1. There are initially three (3) entry points, and can be no less than three (3), leading into the parking complex. A vehicle
  must be assigned a possible and available slot closest to the parking entrance. The mall can decide to add new entrances later.

2. There are three types of vehicles: small (S), medium (M) and large (L),
  and there are three types or parking slots: small (SP), medium (MP) and large (LP).

  - S vehicles can park in SP, MP and LP parking spaces;
  - M vehicles can park in MP and LP parking spaces; and
  - L vehicles can park only in LP parking spaces.

You are free to design the system in any pattern you wish. However, take note that the system assumes the input of the following:

  - The number of entry points to the parking complex, but no less than three (3). Assume that the entry points
      are also exit points, so no need to take into account the number of possible exit points.

  - The map of the parking slot. You are welcome to introduce a design that suits your approach.

  - The sizes of every corresponding parking slot. 

  - Two functions to park a vehicle and unpark it. The functions must consider the attributes of the vehicle as described above.
     
