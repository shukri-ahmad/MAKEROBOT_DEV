/**
 * MAKEROBOT Complete Suite for micro:bit
 * Guaranteed Subcategory Architecture
 */

//% color="#e67e22" icon="\uf1b9" weight=100 block="MAKEROBOT"
//% subcategories='["RC", "BLITZ ROBOT", "BLITZ REMOTE", "TRACER JUNIOR", "TRACER SENIOR"]'
namespace MAKEROBOT {

    // =================================================================
    // SHARED ENUMS (Must be uniquely named inside a single namespace)
    // =================================================================
    
    export enum MotorSide {
        //% block="Left (M1)"
        Left = 1,
        //% block="Right (M2)"
        Right = 2,
        //% block="Both"
        Both = 3
    }

    export enum BlitzDirection {
        //% block="Forward"
        Forward = 1,
        //% block="Backward"
        Backward = 2,
        //% block="Turn Left"
        TurnLeft = 3,
        //% block="Turn Right"
        TurnRight = 4
    }

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

    export enum TracerJuniorSide {
        //% block="Left"
        Left = 1,
        //% block="Right"
        Right = 2
    }


    // =================================================================
    // 1. MAKEROBOT RC (Cytron MDDRC5 - Independent Mode)
    // =================================================================
    
    let rcLeftPin = AnalogPin.P1;
    let rcRightPin = AnalogPin.P2;

    /**
     * Initialize pins for Cytron MDDRC5 (Ensure board switch is set to IND mode)
     */
    //% blockId=makerobot_rc_init
    //% block="init MAKEROBOT RC | Left (RC1) %pinLeft | Right (RC2) %pinRight"
    //% pinLeft.defl=AnalogPin.P1 pinRight.defl=AnalogPin.P2
    //% subcategory="RC" weight=100
    export function rcInit(pinLeft: AnalogPin, pinRight: AnalogPin): void {
        rcLeftPin = pinLeft;
        rcRightPin = pinRight;
        rcStop(MotorSide.Both);
    }

    /**
     * Drive an individual motor or both motors independently
     */
    //% blockId=makerobot_rc_drive_motor
    //% block="MAKEROBOT RC %motor motor | speed %speed | percent"
    //% speed.min=-100 speed.max=100 speed.defl=50
    //% subcategory="RC" weight=90
    export function rcDriveMotor(motor: MotorSide, speed: number): void {
        speed = Math.max(-100, Math.min(100, speed));
        let pulseUs = 1500 + (speed * 5); // Map -100 to 100 -> 1000us to 2000us

        if (motor == MotorSide.Left || motor == MotorSide.Both) {
            pins.servoSetPulse(rcLeftPin as number, pulseUs);
        }
        if (motor == MotorSide.Right || motor == MotorSide.Both) {
            pins.servoSetPulse(rcRightPin as number, pulseUs);
        }
    }

    /**
     * Drive both Left and Right motors with separate speed percentages
     */
    //% blockId=makerobot_rc_drive_dual
    //% block="MAKEROBOT RC drive | Left speed %leftSpeed | percent | Right speed %rightSpeed | percent"
    //% leftSpeed.min=-100 leftSpeed.max=100 leftSpeed.defl=50
    //% rightSpeed.min=-100 rightSpeed.max=100 rightSpeed.defl=50
    //% subcategory="RC" weight=85
    export function rcDriveDual(leftSpeed: number, rightSpeed: number): void {
        rcDriveMotor(MotorSide.Left, leftSpeed);
        rcDriveMotor(MotorSide.Right, rightSpeed);
    }

    /**
     * Stop selected motor(s) by outputting the neutral 1500us RC pulse
     */
    //% blockId=makerobot_rc_stop
    //% block="MAKEROBOT RC stop %motor motor"
    //% subcategory="RC" weight=80
    export function rcStop(motor: MotorSide): void {
        if (motor == MotorSide.Left || motor == MotorSide.Both) {
            pins.servoSetPulse(rcLeftPin as number, 1500);
        }
        if (motor == MotorSide.Right || motor == MotorSide.Both) {
            pins.servoSetPulse(rcRightPin as number, 1500);
        }
    }


    // =================================================================
    // 2. BLITZ ROBOT
    // =================================================================

    /**
     * Move the BLITZ Robot
     */
    //% blockId=blitz_robot_move
    //% block="BLITZ move %dir | speed %speed"
    //% speed.min=0 speed.max=255 speed.defl=200
    //% subcategory="BLITZ ROBOT" weight=90
    export function blitzMove(dir: BlitzDirection, speed: number): void {
        speed = Math.max(0, Math.min(255, speed));

        if (dir == BlitzDirection.Forward) {
            pins.analogWritePin(AnalogPin.P13, speed);
            pins.analogWritePin(AnalogPin.P14, speed);
            pins.digitalWritePin(DigitalPin.P15, 0);
            pins.digitalWritePin(DigitalPin.P16, 0);
        } else if (dir == BlitzDirection.Backward) {
            pins.digitalWritePin(DigitalPin.P13, 0);
            pins.digitalWritePin(DigitalPin.P14, 0);
            pins.analogWritePin(AnalogPin.P15, speed);
            pins.analogWritePin(AnalogPin.P16, speed);
        } else if (dir == BlitzDirection.TurnLeft) {
            pins.digitalWritePin(DigitalPin.P13, 0);
            pins.analogWritePin(AnalogPin.P14, speed);
            pins.analogWritePin(AnalogPin.P15, speed);
            pins.digitalWritePin(DigitalPin.P16, 0);
        } else if (dir == BlitzDirection.TurnRight) {
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
    //% subcategory="BLITZ ROBOT" weight=80
    export function blitzStop(): void {
        pins.digitalWritePin(DigitalPin.P13, 0);
        pins.digitalWritePin(DigitalPin.P14, 0);
        pins.digitalWritePin(DigitalPin.P15, 0);
        pins.digitalWritePin(DigitalPin.P16, 0);
    }


    // =================================================================
    // 3. BLITZ REMOTE
    // =================================================================

    /**
     * Send remote command string over radio or Bluetooth
     */
    //% blockId=blitz_remote_send
    //% block="BLITZ Remote send button %btn | state %pressed"
    //% subcategory="BLITZ REMOTE" weight=90
    export function blitzSendButton(btn: RemoteButton, pressed: boolean): string {
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


    // =================================================================
    // 4. TRACER JUNIOR
    // =================================================================

    /**
     * Read Line IR Sensor state (0 = White/No Line, 1 = Black/Line detected)
     */
    //% blockId=tracer_junior_read_ir
    //% block="TRACER JUNIOR read %sensor sensor"
    //% subcategory="TRACER JUNIOR" weight=90
    export function tracerJuniorRead(sensor: TracerJuniorSide): number {
        let pin = (sensor == TracerJuniorSide.Left) ? DigitalPin.P1 : DigitalPin.P2;
        return pins.digitalReadPin(pin);
    }


    // =================================================================
    // 5. TRACER SENIOR
    // =================================================================

    /**
     * Read Analog Line Sensor value (0 to 1023)
     */
    //% blockId=tracer_senior_read_analog
    //% block="TRACER SENIOR read analog pin %pin"
    //% pin.defl=AnalogPin.P1
    //% subcategory="TRACER SENIOR" weight=90
    export function tracerSeniorRead(pin: AnalogPin): number {
        return pins.analogReadPin(pin);
    }
}
