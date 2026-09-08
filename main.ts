/**
 * MAKEROBOT Complete Suite for micro:bit
 * Unified under a single MAKEROBOT parent category using nested namespaces.
 */

//% color="#e67e22" icon="\uf1b9" weight=100 block="MAKEROBOT"
namespace makerobot {

    // =================================================================
    // 1. MAKEROBOT RC (Cytron MDDRC5 - Independent Mode)
    // =================================================================
    //% color="#d35400" icon="\uf1b9" weight=100 block="RC"
    export namespace rc {

        let leftPin = AnalogPin.P1;
        let rightPin = AnalogPin.P2;

        export enum MotorSide {
            //% block="Left (M1)"
            Left = 1,
            //% block="Right (M2)"
            Right = 2,
            //% block="Both"
            Both = 3
        }

        /**
         * Initialize pins for Cytron MDDRC5 (Ensure board switch is set to IND mode)
         * @param pinLeft Signal pin connected to RC1 (Left Motor)
         * @param pinRight Signal pin connected to RC2 (Right Motor)
         */
        //% blockId=makerobot_rc_init
        //% block="init RC | Left (RC1) %pinLeft | Right (RC2) %pinRight"
        //% pinLeft.defl=AnalogPin.P1 pinRight.defl=AnalogPin.P2
        //% weight=100
        export function init(pinLeft: AnalogPin, pinRight: AnalogPin): void {
            leftPin = pinLeft;
            rightPin = pinRight;
            stop(MotorSide.Both);
        }

        /**
         * Drive an individual motor or both motors independently
         * @param motor Select Left, Right, or Both motors
         * @param speed Speed percentage (-100 to 100)
         */
        //% blockId=makerobot_rc_drive_motor
        //% block="RC %motor motor | speed %speed | percent"
        //% speed.min=-100 speed.max=100 speed.defl=50
        //% weight=90
        export function driveMotor(motor: MotorSide, speed: number): void {
            speed = Math.max(-100, Math.min(100, speed));
            
            // RC Pulse Mapping: Neutral = 1500us, Full Forward (+100%) = 2000us, Full Reverse (-100%) = 1000us
            let pulseUs = 1500 + (speed * 5);

            if (motor == MotorSide.Left || motor == MotorSide.Both) {
                pins.servoSetPulse(leftPin as number, pulseUs);
            }
            if (motor == MotorSide.Right || motor == MotorSide.Both) {
                pins.servoSetPulse(rightPin as number, pulseUs);
            }
        }

        /**
         * Drive both Left and Right motors with separate speed percentages
         * @param leftSpeed Left motor speed (-100 to 100)
         * @param rightSpeed Right motor speed (-100 to 100)
         */
        //% blockId=makerobot_rc_drive_dual
        //% block="RC drive | Left speed %leftSpeed | percent | Right speed %rightSpeed | percent"
        //% leftSpeed.min=-100 leftSpeed.max=100 leftSpeed.defl=50
        //% rightSpeed.min=-100 rightSpeed.max=100 rightSpeed.defl=50
        //% weight=85
        export function driveDual(leftSpeed: number, rightSpeed: number): void {
            driveMotor(MotorSide.Left, leftSpeed);
            driveMotor(MotorSide.Right, rightSpeed);
        }

        /**
         * Stop selected motor(s) by outputting the neutral 1500us RC pulse
         * @param motor Select Left, Right, or Both motors
         */
        //% blockId=makerobot_rc_stop
        //% block="RC stop %motor motor"
        //% weight=80
        export function stop(motor: MotorSide): void {
            if (motor == MotorSide.Left || motor == MotorSide.Both) {
                pins.servoSetPulse(leftPin as number, 1500);
            }
            if (motor == MotorSide.Right || motor == MotorSide.Both) {
                pins.servoSetPulse(rightPin as number, 1500);
            }
        }
    }

    // =================================================================
    // 2. BLITZ ROBOT
    // =================================================================
    //% color="#2980b9" icon="\uf1b9" weight=90 block="BLITZ ROBOT"
    export namespace blitzRobot {

        export enum Direction {
            //% block="Forward"
            Forward = 1,
            //% block="Backward"
            Backward = 2,
            //% block="Turn Left"
            TurnLeft = 3,
            //% block="Turn Right"
            TurnRight = 4
        }

        /**
         * Move the BLITZ Robot
         * @param dir Direction to move
         * @param speed Speed (0 to 255)
         */
        //% blockId=blitz_robot_move
        //% block="BLITZ move %dir | speed %speed"
        //% speed.min=0 speed.max=255 speed.defl=200
        //% weight=90
        export function move(dir: Direction, speed: number): void {
            speed = Math.max(0, Math.min(255, speed));

            if (dir == Direction.Forward) {
                pins.analogWritePin(AnalogPin.P13, speed);
                pins.analogWritePin(AnalogPin.P14, speed);
                pins.digitalWritePin(DigitalPin.P15, 0);
                pins.digitalWritePin(DigitalPin.P16, 0);
            } else if (dir == Direction.Backward) {
                pins.digitalWritePin(DigitalPin.P13, 0);
                pins.digitalWritePin(DigitalPin.P14, 0);
                pins.analogWritePin(AnalogPin.P15, speed);
                pins.analogWritePin(AnalogPin.P16, speed);
            } else if (dir == Direction.TurnLeft) {
                pins.digitalWritePin(DigitalPin.P13, 0);
                pins.analogWritePin(AnalogPin.P14, speed);
                pins.analogWritePin(AnalogPin.P15, speed);
                pins.digitalWritePin(DigitalPin.P16, 0);
            } else if (dir == Direction.TurnRight) {
                pins.analogWritePin(AnalogPin.P13, speed);
                pins.digitalWritePin(DigitalPin.P14, 0);
                pins.digitalWritePin(DigitalPin.P15, 0);
                pins.analogWritePin(AnalogPin.P16, speed);
            }
        }

        /**
         * Stop / Brake the BLITZ Robot
         */
        //% blockId=blitz_robot_stop
        //% block="BLITZ stop"
        //% weight=80
        export function stop(): void {
            pins.digitalWritePin(DigitalPin.P13, 0);
            pins.digitalWritePin(DigitalPin.P14, 0);
            pins.digitalWritePin(DigitalPin.P15, 0);
            pins.digitalWritePin(DigitalPin.P16, 0);
        }
    }

    // =================================================================
    // 3. BLITZ REMOTE
    // =================================================================
    //% color="#8e44ad" icon="\uf11b" weight=80 block="BLITZ REMOTE"
    export namespace blitzRemote {

        export enum RemoteButton {
            //% block="UP"
            Up = 1,
            //% block="DOWN"
            Down = 2,
            //% block="LEFT"
            Left = 3,
            //% block="RIGHT"
            Right = 4,
            //% block="A"
            A = 5,
            //% block="B"
            B = 6,
            //% block="X"
            X = 7,
            //% block="Y"
            Y = 8
        }

        /**
         * Send remote command string over radio or Bluetooth
         * @param btn Button pressed
         * @param pressed True for pressed (1), false for released (0)
         */
        //% blockId=blitz_remote_send
        //% block="BLITZ Remote send button %btn | state %pressed"
        //% weight=90
        export function sendButton(btn: RemoteButton, pressed: boolean): string {
            let code = "";
            switch (btn) {
                case RemoteButton.Up: code = "DIR_U"; break;
                case RemoteButton.Down: code = "DIR_D"; break;
                case RemoteButton.Left: code = "DIR_L"; break;
                case RemoteButton.Right: code = "DIR_R"; break;
                case RemoteButton.A: code = "ACT_A"; break;
                case RemoteButton.B: code = "ACT_B"; break;
                case RemoteButton.X: code = "ACT_X"; break;
                case RemoteButton.Y: code = "ACT_Y"; break;
            }
            return code + (pressed ? "_ON#" : "_OFF#");
        }
    }

    // =================================================================
    // 4. TRACER JUNIOR
    // =================================================================
    //% color="#2ecc71" icon="\uf06e" weight=70 block="TRACER JUNIOR"
    export namespace tracerJunior {

        export enum SensorSide {
            //% block="Left"
            Left = 1,
            //% block="Right"
            Right = 2
        }

        /**
         * Read Line IR Sensor state (0 = White/No Line, 1 = Black/Line detected)
         * @param sensor Select Left or Right IR sensor pin
         */
        //% blockId=tracer_junior_read_ir
        //% block="TRACER JUNIOR read %sensor sensor"
        //% weight=90
        export function readSensor(sensor: SensorSide): number {
            let pin = (sensor == SensorSide.Left) ? DigitalPin.P1 : DigitalPin.P2;
            return pins.digitalReadPin(pin);
        }
    }

    // =================================================================
    // 5. TRACER SENIOR
    // =================================================================
    //% color="#27ae60" icon="\uf06e" weight=60 block="TRACER SENIOR"
    export namespace tracerSenior {

        /**
         * Read Analog Line Sensor value (0 to 1023)
         * @param pin Analog pin connected to sensor
         */
        //% blockId=tracer_senior_read_analog
        //% block="TRACER SENIOR read analog pin %pin"
        //% pin.defl=AnalogPin.P1
        //% weight=90
        export function readAnalog(pin: AnalogPin): number {
            return pins.analogReadPin(pin);
        }
    }
}
