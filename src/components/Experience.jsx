import { Float, PerspectiveCamera, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Euler, Group, Vector3 } from "three";
import { usePlay } from "../contexts/Play";
import { fadeOnBeforeCompile } from "../utils/fadeMaterial";
import { Background } from "./Background";
import { Cloud } from "./Cloud";
import { Speed } from "./Speed";
import { TextSection } from "./TextSection";
import { Owl } from "./Owl";
import { Stars } from "@react-three/drei";
import { Howl } from "howler";

const LINE_NB_POINTS = 1000;
const CURVE_DISTANCE = 250;
const CURVE_AHEAD_CAMERA = 0.008;
const CURVE_AHEAD_AIRPLANE = 0.02;
const AIRPLANE_MAX_ANGLE = 35;
const FRICTION_DISTANCE = 42;

export const Experience = () => {
  const curvePoints = useMemo(
    () => [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -2 * CURVE_DISTANCE),
      new THREE.Vector3(-100, 0, -3 * CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -4 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -5 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -6 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -7 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -8 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -9 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -10 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -11 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -12 * CURVE_DISTANCE),
    ],
    []
  );

  const owlSound = useMemo(
    () =>
      new Howl({
        src: ["/audio/owl_music.mp3"],
        volume: 1.0,
        loop: true
      }),
    []
  );

  const sceneOpacity = useRef(0);
  const lineMaterialRef = useRef();

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.5);
  }, [curvePoints]);

  const textSections = useMemo(() => [
    {
      cameraRailDist: -1,
      position: new Vector3(
        curvePoints[1].x - 3,
        curvePoints[1].y,
        curvePoints[1].z
      ),
      title: "Welcome to LQ130.7",
      subtitle: `LQ130.7 is a movement for the most curious minds in technology & innovation. A community where thought leaders, unique professionals, and budding student talent unite to shape the future.`
    },
    {
      cameraRailDist: 1.5,
      position: new Vector3(
        curvePoints[2].x + 2,
        curvePoints[2].y,
        curvePoints[2].z
      ),
      title: "Why Community?",
      subtitle: `Whether you're a seasoned expert or emerging talent, LQ130.7 offers:\n\n• A growing network of thought leaders who challenge conventional thinking\n• A launchpad for ideas, collaborations, and support\n• A space to grow, gain exposure, and build influence\n• A shared purpose—be part of something bigger than work`
    },
    {
      cameraRailDist: -1,
      position: new Vector3(
        curvePoints[3].x - 3,
        curvePoints[3].y,
        curvePoints[3].z
      ),
      title: "Decode LQ130.7",
      subtitle: `Etymology of LQ130.7`
    },
    {
      cameraRailDist: 1.5,
      position: new Vector3(
        curvePoints[4].x + 3.5,
        curvePoints[4].y,
        curvePoints[4].z - 12
      ),
      title: "Why Join LQ130.7?",
      subtitle: `By joining, you access powerful ideas and bold collaborations. Learn, lead, and be visible among the best in digital and tech.`
    },
    {
      cameraRailDist: -1,
      position: new Vector3(
        curvePoints[5].x - 3,
        curvePoints[5].y,
        curvePoints[5].z
      ),
      title: "Opportunities",
      subtitle: `• Shape the future with like-minded professionals\n• Share and receive knowledge with leaders and deep technical experts\n• Connect with top-tier minds driving real-world transformation\n• Express yourself, mentor, publish ideas, and influence the future\n• Stay ahead with curated intelligence from a global think tank\n• Pitch, connect, and refine disruptive ideas\n• Access exclusive career opportunities within the network`
    },
    {
      cameraRailDist: 1.5,
      position: new Vector3(
        curvePoints[6].x + 2,
        curvePoints[6].y,
        curvePoints[6].z
      ),
      title: "Are You a Student?",
      subtitle: `We’ve got you covered:\n\n• Mentorship by Experts: Learn from industry leaders\n• Real-World Exposure: Work on live case challenges, research, and idea labs\n• Skill Building & Certification: Gain practical, future-focused skills\n• Visibility & Recognition: Stand out to recruiters and mentors\n• Career Pathways: Fast-track your entry into partner companies`
    },
    {
      cameraRailDist: -1,
      position: new Vector3(
        curvePoints[7].x - 3,
        curvePoints[7].y,
        curvePoints[7].z
      ),
      title: "How to Join?",
      subtitle: `We welcome professionals with deep technical expertise and a passion for shaping the future. If you’ve been invited, it’s because a like-minded professional believes you can add value beyond your current role.\n\nIdeal members have:\n• Demonstrated excellence in innovative technologies\n• (Ideally) understanding of the retail domain, but all backgrounds welcome\n• Passion for sharing knowledge, mentoring, and driving change\n• Solution-oriented, innovative, forward-thinking mindset\n\nReady to join? Click the link below, share your details, and we’ll connect you to the LQ130.7 community.`
    },
    {
      cameraRailDist: 1.5,
      position: new Vector3(
        curvePoints[7].x + 8,
        curvePoints[7].y + 5,
        curvePoints[7].z + 60
      ),
      title: "Who’s Behind LQ130.7?",
      subtitle: `LQ130.7 is powered by Litmus7, a global leader in retail-led transformation. But this is not just our initiative—it’s your platform. Litmus7 provides the foundation, resources, and vision. The growth, strength, and success of this community comes from you, the members. Together, we create a quotient that defines what is next.`
    }
  ], [curvePoints]);

const clouds = useMemo(
    () => [
      // STARTING
      {
        position: new Vector3(-3.5, -3.2, -7),
      },
      {
        position: new Vector3(3.5, -4, -10),
      },
      {
        scale: new Vector3(4, 4, 4),
        position: new Vector3(-18, 0.2, -68),
        rotation: new Euler(-Math.PI / 5, Math.PI / 6, 0),
      },
      {
        scale: new Vector3(2.5, 2.5, 2.5),
        position: new Vector3(10, -1.2, -52),
      },
      // FIRST POINT
      {
        scale: new Vector3(4, 4, 4),
        position: new Vector3(
          curvePoints[1].x + 10,
          curvePoints[1].y - 4,
          curvePoints[1].z + 64
        ),
      },
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[1].x - 20,
          curvePoints[1].y + 4,
          curvePoints[1].z + 28
        ),
        rotation: new Euler(0, Math.PI / 7, 0),
      },
      {
        rotation: new Euler(0, Math.PI / 7, Math.PI / 5),
        scale: new Vector3(5, 5, 5),
        position: new Vector3(
          curvePoints[1].x - 13,
          curvePoints[1].y + 4,
          curvePoints[1].z - 62
        ),
      },
      {
        rotation: new Euler(Math.PI / 2, Math.PI / 2, Math.PI / 3),
        scale: new Vector3(5, 5, 5),
        position: new Vector3(
          curvePoints[1].x + 54,
          curvePoints[1].y + 2,
          curvePoints[1].z - 82
        ),
      },
      {
        scale: new Vector3(5, 5, 5),
        position: new Vector3(
          curvePoints[1].x + 8,
          curvePoints[1].y - 14,
          curvePoints[1].z - 22
        ),
      },
      // SECOND POINT
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[2].x + 6,
          curvePoints[2].y - 7,
          curvePoints[2].z + 50
        ),
      },
      {
        scale: new Vector3(2, 2, 2),
        position: new Vector3(
          curvePoints[2].x - 2,
          curvePoints[2].y + 4,
          curvePoints[2].z - 26
        ),
      },
      {
        scale: new Vector3(4, 4, 4),
        position: new Vector3(
          curvePoints[2].x + 12,
          curvePoints[2].y + 1,
          curvePoints[2].z - 86
        ),
        rotation: new Euler(Math.PI / 4, 0, Math.PI / 3),
      },
      // THIRD POINT
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[3].x + 3,
          curvePoints[3].y - 10,
          curvePoints[3].z + 50
        ),
      },
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[3].x - 10,
          curvePoints[3].y,
          curvePoints[3].z + 30
        ),
        rotation: new Euler(Math.PI / 4, 0, Math.PI / 5),
      },
      {
        scale: new Vector3(4, 4, 4),
        position: new Vector3(
          curvePoints[3].x - 20,
          curvePoints[3].y - 5,
          curvePoints[3].z - 8
        ),
        rotation: new Euler(Math.PI, 0, Math.PI / 5),
      },
      {
        scale: new Vector3(5, 5, 5),
        position: new Vector3(
          curvePoints[3].x + 0,
          curvePoints[3].y - 5,
          curvePoints[3].z - 98
        ),
        rotation: new Euler(0, Math.PI / 3, 0),
      },
      // FOURTH POINT
      {
        scale: new Vector3(2, 2, 2),
        position: new Vector3(
          curvePoints[4].x + 3,
          curvePoints[4].y - 10,
          curvePoints[4].z + 2
        ),
      },
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[4].x + 24,
          curvePoints[4].y - 6,
          curvePoints[4].z - 42
        ),
        rotation: new Euler(Math.PI / 4, 0, Math.PI / 5),
      },
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[4].x - 4,
          curvePoints[4].y + 9,
          curvePoints[4].z - 62
        ),
        rotation: new Euler(Math.PI / 3, 0, Math.PI / 3),
      },
      // FINAL
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[7].x + 12,
          curvePoints[7].y - 5,
          curvePoints[7].z + 60
        ),
        rotation: new Euler(-Math.PI / 4, -Math.PI / 6, 0),
      },
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[7].x - 12,
          curvePoints[7].y + 5,
          curvePoints[7].z + 120
        ),
        rotation: new Euler(Math.PI / 4, Math.PI / 6, 0),
      },
    ],
    []
  );

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.08);
    shape.lineTo(0, 0.08);
    return shape;
  }, [curve]);

  const cameraGroup = useRef();
  const cameraRail = useRef();
  const camera = useRef();
  const scroll = useScroll();
  const lastScroll = useRef(0);

  const { play, setHasScroll, end, setEnd } = usePlay();

  const airplane = useRef();
  const tl = useRef();
  const backgroundColors = useRef({
    colorA: "#3535cc",
    colorB: "#abaadd",
  });

  const planeInTl = useRef();
  const planeOutTl = useRef();

  useFrame((_state, delta) => {
    if (window.innerWidth > window.innerHeight) {
      camera.current.fov = 30;
      camera.current.position.z = 5;
    } else {
      camera.current.fov = 80;
      camera.current.position.z = 2;
    }

    if (lastScroll.current <= 0 && scroll.offset > 0) {
      setHasScroll(true);
    }

    if (play && !end && sceneOpacity.current < 1) {
      sceneOpacity.current = THREE.MathUtils.lerp(
        sceneOpacity.current,
        1,
        delta * 0.1
      );
    }

    if (end && sceneOpacity.current > 0) {
      sceneOpacity.current = THREE.MathUtils.lerp(
        sceneOpacity.current,
        0,
        delta
      );
    }

    lineMaterialRef.current.opacity = sceneOpacity.current;

    if (end) {
      return;
    }

    const scrollOffset = Math.max(0, scroll.offset);

    let friction = 1;
    let resetCameraRail = true;
    textSections.forEach((textSection) => {
      const distance = textSection.position.distanceTo(
        cameraGroup.current.position
      );
      if (distance < FRICTION_DISTANCE) {
        friction = Math.max(distance / FRICTION_DISTANCE, 0.1);
        const targetCameraRailPosition = new Vector3(
          (1 - distance / FRICTION_DISTANCE) * textSection.cameraRailDist,
          0,
          0
        );
        cameraRail.current.position.lerp(targetCameraRailPosition, delta);
        resetCameraRail = false;
      }
    });
    if (resetCameraRail) {
      const targetCameraRailPosition = new Vector3(0, 0, 0);
      cameraRail.current.position.lerp(targetCameraRailPosition, delta);
    }

    const isReverse = scrollOffset < lastScroll.current;
    let lerpedScrollOffset;
    if (isReverse) {
      lerpedScrollOffset = scrollOffset;
    } else {
      lerpedScrollOffset = THREE.MathUtils.lerp(
        lastScroll.current,
        scrollOffset,
        delta * friction
      );
    }
    lerpedScrollOffset = Math.min(lerpedScrollOffset, 1);
    lerpedScrollOffset = Math.max(lerpedScrollOffset, 0);

    lastScroll.current = lerpedScrollOffset;
    tl.current.seek(lerpedScrollOffset * tl.current.duration());

    const curPoint = curve.getPoint(lerpedScrollOffset);
    cameraGroup.current.position.lerp(curPoint, delta * 24);

    const lookAtPoint = curve.getPoint(
      Math.min(lerpedScrollOffset + CURVE_AHEAD_CAMERA, 1)
    );
    const currentLookAt = cameraGroup.current.getWorldDirection(
      new THREE.Vector3()
    );
    const targetLookAt = new THREE.Vector3()
      .subVectors(curPoint, lookAtPoint)
      .normalize();
    const lookAt = currentLookAt.lerp(targetLookAt, delta * 24);
    cameraGroup.current.lookAt(
      cameraGroup.current.position.clone().add(lookAt)
    );

    const tangent = curve.getTangent(lerpedScrollOffset + CURVE_AHEAD_AIRPLANE);
    const nonLerpLookAt = new Group();
    nonLerpLookAt.position.copy(curPoint);
    nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLookAt));
    tangent.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      -nonLerpLookAt.rotation.y
    );
    let angle = Math.atan2(-tangent.z, tangent.x);
    angle = -Math.PI / 2 + angle;
    let angleDegrees = (angle * 180) / Math.PI;
    angleDegrees *= 2.4;
    if (angleDegrees < 0) {
      angleDegrees = Math.max(angleDegrees, -AIRPLANE_MAX_ANGLE);
    }
    if (angleDegrees > 0) {
      angleDegrees = Math.min(angleDegrees, AIRPLANE_MAX_ANGLE);
    }
    angle = (angleDegrees * Math.PI) / 180;
    const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        airplane.current.rotation.y,
        angle
      )
    );
    airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2);

    if (
      cameraGroup.current.position.z <
      curvePoints[curvePoints.length - 1].z + 100
    ) {
      setEnd(true);
      planeOutTl.current.play();
    }
  });

  useLayoutEffect(() => {
    tl.current = gsap.timeline();
    tl.current.to(backgroundColors.current, {
      duration: 1,
      colorA: "#6f35cc",
      colorB: "#ffad30",
    });
    tl.current.to(backgroundColors.current, {
      duration: 1,
      colorA: "#424242",
      colorB: "#ffcc00",
    });
    tl.current.to(backgroundColors.current, {
      duration: 1,
      colorA: "#81318b",
      colorB: "#55ab8f",
    });
    tl.current.pause();

    planeInTl.current = gsap.timeline();
    planeInTl.current.pause();
    planeInTl.current.from(airplane.current.position, {
      duration: 3,
      z: 5,
      y: -2,
    });

    planeOutTl.current = gsap.timeline();
    planeOutTl.current.pause();
    planeOutTl.current.to(
      airplane.current.position,
      {
        duration: 10,
        z: -250,
        y: 10,
      },
      0
    );
    planeOutTl.current.to(
      cameraRail.current.position,
      {
        duration: 8,
        y: 12,
      },
      0
    );
    planeOutTl.current.to(airplane.current.position, {
      duration: 1,
      z: -1000,
    });
  }, []);

  useEffect(() => {
    if (play) {
      planeInTl.current.play();
      owlSound.stop();
      owlSound.play();
    }
  }, [play, owlSound]);

  return useMemo(
    () => (
      <>
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        <directionalLight position={[0, 3, 1]} intensity={0.1} />
        <group ref={cameraGroup}>
          <Speed />
          <Background backgroundColors={backgroundColors} />
          <group ref={cameraRail}>
            <PerspectiveCamera
              ref={camera}
              position={[0, 0, 5]}
              fov={30}
              makeDefault
            />
          </group>
          <group ref={airplane}>
            <Float floatIntensity={1} speed={1.5} rotationIntensity={0.5}>
              <Owl rotation-y={Math.PI} position-y={0.1} scale={[0.01, 0.01, 0.01]} />
            </Float>
          </group>
        </group>
        {textSections.map((textSection, index) => (
          <TextSection {...textSection} key={index} />
        ))}
        <group position-y={-2}>
          <mesh>
            <extrudeGeometry
              args={[
                shape,
                {
                  steps: LINE_NB_POINTS,
                  bevelEnabled: false,
                  extrudePath: curve,
                },
              ]}
            />
            <meshStandardMaterial
              color={"white"}
              ref={lineMaterialRef}
              transparent
              envMapIntensity={2}
              onBeforeCompile={fadeOnBeforeCompile}
            />
          </mesh>
        </group>
        {clouds.map((cloud, index) => (
          <Cloud sceneOpacity={sceneOpacity} {...cloud} key={index} />
        ))}
      </>
    ),
    []
  );
};