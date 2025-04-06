export class EscPosCommands {
    // 기본 명령어
    public static get InitializePrinter(): string {
        return "\x1B\x40"; // 프린터 초기화
    }

    public static get LineFeed(): string {
        return "\x0A"; // 줄 바꿈
    }

    public static FeedLines(count: number): string {
        return "\x0A".repeat(count);
    }

    // 종이 절단
    public static get FullCut(): string {
        return "\x1D\x56\x00"; // 전체 절단
    }

    public static get PartialCut(): string {
        return "\x1D\x56\x42"; // 부분 절단
    }

    // 텍스트 서식
    public static get DoubleSize(): string {
        return "\x1D\x21\x11"; // 2배 확대
    }

    public static get DoubleWidth(): string {
        return "\x1D\x21\x10"; // 가로만 2배
    }

    public static get DoubleHeight(): string {
        return "\x1D\x21\x01"; // 세로만 2배
    }

    public static get NormalSize(): string {
        return "\x1D\x21\x00"; // 기본 크기
    }

    public static get BoldOn(): string {
        return "\x1B\x45\x01"; // 굵은 글씨
    }

    public static get BoldOff(): string {
        return "\x1B\x45\x00"; // 굵은 글씨 해제
    }

    public static get UnderlineOn(): string {
        return "\x1B\x2D\x01"; // 밑줄
    }

    public static get UnderlineOff(): string {
        return "\x1B\x2D\x00"; // 밑줄 해제
    }

    // 정렬
    public static get AlignLeft(): string {
        return "\x1B\x61\x00"; // 왼쪽 정렬
    }

    public static get AlignCenter(): string {
        return "\x1B\x61\x01"; // 중앙 정렬
    }

    public static get AlignRight(): string {
        return "\x1B\x61\x02"; // 오른쪽 정렬
    }

    // 스타일
    public static get InvertedColorsOn(): string {
        return "\x1D\x42\x01"; // 역상 인쇄
    }

    public static get InvertedColorsOff(): string {
        return "\x1D\x42\x00"; // 역상 인쇄 해제
    }

    // 바코드
    public static PrintBarcodeCode39(data: string): string {
        return `\x1D\x6B\x04${data}\x00`; // Code39 바코드 출력
    }

    // 기타
    public static get Beep(): string {
        return "\x1B\x07"; // 비프음 발생
    }

    public static get OpenCashDrawer(): string {
        return "\x1B\x70\x00\x19\xFA"; // 캐시 드로우 열기
    }
}
