// Black box with text at the bottom of canvas
var AnimationWithBlackBox = function (lib, img, cjs, txt) {

    CommonAnimationBase.call(this, lib, img, cjs, txt);

    (lib.IncidentsNameBG = function () {
        this.initialize(img.imageBg);
    }).prototype = p = new cjs.Bitmap();
    p.nominalBounds = new cjs.Rectangle(0, 0, 175, 44);

    (lib.IncidentsNameBG_MC = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Layer 1
        this.instance = new lib.IncidentsNameBG();
        this.instance.parent = this;

        this.timeline.addTween(cjs.Tween.get(this.instance, {loop:false}));

    }).prototype = this.getMCSymbolPrototype(lib.IncidentsNameBG_MC, new cjs.Rectangle(0, 0, 175, 44), null);

    (lib.Incident_Text = function (mode, startPosition, loop, txt) {
        this.initialize(mode, startPosition, loop, {});

        // Layer 1
        this.incTXT = new cjs.Text(txt.header, "bold " + txt.headerSize +"px 'Arial'", "#F7941E");
        this.incTXT.name = "incTXT";
        this.incTXT.textAlign = "center";
        this.incTXT.lineHeight = 16;
        this.incTXT.lineWidth = 128;
        this.incTXT.parent = this;
        this.incTXT.setTransform(58.8, 2);

        this.timeline.addTween(cjs.Tween.get(this.incTXT, {loop:false}));

    }).prototype = this.getMCSymbolPrototype(lib.Incident_Text, new cjs.Rectangle(0, 0, 117.6, 17.7), null);

    this.showAnimatedText = function (animator, txt) {

        if (!txt) return;

        // txt
        animator.instance_txt = new lib.Incident_Text(undefined, undefined, undefined, txt);
        animator.instance_txt.parent = animator;
        animator.instance_txt.setTransform(333, 280.1, 1, 1, 0, 0, 0, 58.8, 8.8);
        animator.instance_txt._off = true;

        animator.timeline.addTween(cjs.Tween.get(animator.instance_txt, {loop:false})
            .to({ _off: false })
            .to({ y: 235 }, 4, cjs.Ease.linear)
            //.to({ y: 234.6 }, 4, cjs.Ease.get(-1))
            //.wait()
            //.to({ y: 233.1 }, 2)
            //.to({ y: 280.1 }, 4)
            //.wait(MAX_ANIMATION_TIMEOUT)
        );

        // IncidentsNameBG
        animator.instance_bg = new lib.IncidentsNameBG_MC(undefined, undefined, undefined);
        animator.instance_bg.parent = animator;
        animator.instance_bg.setTransform(333, 274.5, 1, 1, 0, 0, 0, 87.5, 22);
        animator.instance_bg._off = true;
        animator.instance_bg.autoReset = false;

        animator.timeline.addTween(cjs.Tween.get(animator.instance_bg, { loop: false })
            .to({ _off: false })
            .to({ y: 230 }, 4, cjs.Ease.linear)
            //.to({ y: 229 }, 4, cjs.Ease.get(-1))
            //.wait(14)
            //.to({ y: 227.5 }, 2)
            //.to({ y: 274.5 }, 4)
            //.wait(MAX_ANIMATION_TIMEOUT)
        );

        //console.log('init black box')
        this.initializeFrameHandler(animator);
    };

    // Animation with dynamic text
    (lib.getExportRoot = function (mode, startPosition, loop, txt) {
        //console.log('EXPORT ROOT BB')
        this.initialize(mode, startPosition, false, { "in": 0, out: 20 });
        this.skipFreezingOfAnimation = true;
        var bb = new AnimationWithBlackBox(lib, img, cjs, lib.txt);
        bb.showAnimatedText(this, lib.txt);

    }).prototype = p = new cjs.MovieClip();

    p.nominalBounds = null;
    // library properties:
    lib.properties = {
        width: 666,
        height: 250,
        fps: 24,
        color: "#FFFFFF",
        opacity: 1.00,
        webfonts: {},
        manifest: [
            { src: "animations/separated/commonEvents/images/IncidentsNameBG.png", id: "imageBg" }
        ],
        preloads: []
    };
};
AnimationWithBlackBox.prototype = Object.create(CommonAnimationBase.prototype);
AnimationWithBlackBox.prototype.constructor = CommonAnimationBase;

// White box with text in the middle of the canvas
var AnimationWithWhiteStrip = function (lib, img, cjs, txt) {

    CommonAnimationBase.call(this, lib, img, cjs, txt);

    (lib.shadeStrip_MC = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Layer 1
        this.shape = new cjs.Shape();
        this.shape.graphics.f("#000000").s().p("A9bDbIDIm1MA0mAAAIDJG1g");
        this.shape.setTransform(188.4, 21.9);

        this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

    }).prototype = this.getMCSymbolPrototype(lib.shadeStrip_MC, new cjs.Rectangle(0, 0, 376.7, 43.9), null);

    (lib.textRect = function (mode, startPosition, loop, textObj) {
        this.initialize(mode, startPosition, loop, {});

        console.log('header font', textObj.headerSize)

        // Header line (event name)
        this.eventTXT = new cjs.Text(textObj.header, textObj.headerSize + "px 'felix007'", "#FF9600");
        this.eventTXT.name = "eventTXT";
        this.eventTXT.textAlign = "center";
        this.eventTXT.lineHeight = textObj.headerSize;
        this.eventTXT.lineWidth = 250;
        this.eventTXT.parent = this;
        this.eventTXT.setTransform(38.4, textObj.addLine && textObj.addLine.length > 0 ? -1 * (textObj.headerSize) / 2 : 1);

        this.timeline.addTween(cjs.Tween.get(this.eventTXT).wait(1));

        // Additional row (team name, player name, etc)
        if (textObj.addLine) {
            this.addTxt = new cjs.Text(textObj.addLine, textObj.addLineSize + "px 'felix007'", "#FF9600");
            this.addTxt.name = "addTxt";
            this.addTxt.textAlign = "center";
            this.addTxt.lineHeight = textObj.addLineSize;
            this.addTxt.lineWidth = 250;
            this.addTxt.parent = this;
            this.addTxt.setTransform(38.4, 12);
            this.timeline.addTween(cjs.Tween.get(this.addTxt).wait(1));
        }

    }).prototype = this.getMCSymbolPrototype(lib.textRect, new cjs.Rectangle(-15.1, -4.2, 120, 29.7), null);

    (lib.WhiteStrip_MC = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // white
        this.shape = new cjs.Shape();
        this.shape.graphics.lf(["rgba(255,255,255,0)", "#FFFFFF", "#FFFFFF", "rgba(255,255,255,0)"], [0, 0.157, 0.843, 1], -228.5, 2, 228.5, 2).s().p("EgjsAD6IAAnzMBHZAAAIAAHzg");
        this.shape.setTransform(231.3, 25.2);

        this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

        // shade
        this.instance = new lib.shadeStrip_MC();
        this.instance.parent = this;
        this.instance.setTransform(225.9, 37.9, 1, 1, 0, 0, 0, 181.3, 21.9);
        this.instance.alpha = 0.32;
        this.instance.filters = [new cjs.BlurFilter(8, 8, 3)];
        this.instance.cache(-2, -2, 381, 48);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

    }).prototype = this.getMCSymbolPrototype(lib.WhiteStrip_MC, new cjs.Rectangle(2.8, 0.2, 457, 73.9), null);

    // Used in external animations
    this.showAnimatedText = function (animator, txt) {

        // Text
        animator.instance_txt = new lib.textRect(undefined, undefined, undefined, txt);
        animator.instance_txt.parent = animator;
        animator.instance_txt.setTransform(-99, 94.8, 1, 1, 0, 0, 0, 36, 8);
        animator.instance_txt.alpha = 0;
        animator.instance_txt._off = true;

        animator.timeline
            .addTween(cjs.Tween.get(animator.instance_txt)
            .wait(3)
            .to({ _off: false }, 0)
            .to({ x: 341, alpha: 1 }, 6)
            .to({ x: 331 }, 3)
            //.wait(MAX_ANIMATION_TIMEOUT)
            //.wait(12)
            //.to({ x: 341 }, 3)
            //.wait(86400)
            //.to({ x: -99, alpha: 0 }, 5)
            //.wait(3)
        );

        // White strip
        animator.instance_1 = new lib.WhiteStrip_MC();
        animator.instance_1.parent = animator;
        animator.instance_1.setTransform(-99.5, 107.5, 1, 1, 0, 0, 0, 228.5, 35.5);
        animator.instance_1.alpha = 0;
        animator.instance_1._off = true;

        animator.timeline.addTween(cjs.Tween.get(animator.instance_1)
            .wait(3)
            .to({ _off: false }, 0)
            .to({ x: 340.5, alpha: 1 }, 6)
            .to({ x: 330.5 }, 3)
            //.wait(MAX_ANIMATION_TIMEOUT)
            //.wait(12)
            //.to({ x: 340.5 }, 3)
            //.wait(86400)
            //.to({ x: -99.5, alpha: 0 }, 5)
        );

        //console.log('init forward & backward')
        this.initializeFrameHandler(animator);

    };

    // Animation with dynamic text
    (lib.getExportRoot = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, { "in": 0, out: 20 });
        var bb = new AnimationWithWhiteStrip(lib, img, cjs, lib.txt);
        bb.showAnimatedText(this, lib.txt);

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = null;

    // library properties:
    lib.properties = {
        width: 666,
        height: 250,
        fps: 24,
        color: "#FFFFFF",
        opacity: 1.00,
        webfonts: {},
        manifest: [],
        preloads: []
    };
}
AnimationWithWhiteStrip.prototype = Object.create(CommonAnimationBase.prototype);
AnimationWithWhiteStrip.prototype.constructor = CommonAnimationBase;

// White box with text in the middle of the canvas + clock icon
var AnimationWithWhiteStripAndTimer = function (lib, img, cjs, txt) {

    CommonAnimationBase.call(this, lib, img, cjs, txt);

    (lib.clock_MC = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Layer 1
        this.shape = new cjs.Shape();
        this.shape.graphics.lf(["#65ADD3", "#3B5B72", "#467FA3", "#AFD8E0", "#E6EBED", "#C1DCE3", "#467FA3"], [0, 0.259, 0.4, 0.51, 0.761, 0.851, 1], 3.5, 5.9, -4.6, -4.4).s().p("AgDBGQgKgDgPgNQgSgPgMgXQgRgbAMgNIA3guQgQAVAiAqQAkAqAXgMQgxAqgGADQgFADgGAAIgGgBg");
        this.shape.setTransform(62, 35.2);

        this.shape_1 = new cjs.Shape();
        this.shape_1.graphics.lf(["#DAE0E6", "#FFFFFF"], [0, 1], 16.1, 19.1, -2.3, -2.8).s().p("AAQAkQgMgEgMgOQgNgNgGgOQgHgPAEgHQADgIAMAEQAMAEAMAOQANANAGAOQAHAPgDAHQgDAFgGAAIgHgBg");
        this.shape_1.setTransform(64.1, 32.2);

        this.shape_2 = new cjs.Shape();
        this.shape_2.graphics.lf(["#D5E0E6", "#F6FBFC"], [0, 1], 16.4, 19.6, -2.4, -2.8).s().p("AAQAlQgMgFgMgNQgOgOgGgOQgHgPAEgIQAEgIAMAFQAMAEAMAOQANAOAHAOQAHAOgEAIQgCAFgGAAIgIgBg");
        this.shape_2.setTransform(64.1, 32.2);

        this.shape_3 = new cjs.Shape();
        this.shape_3.graphics.lf(["#D1DFE6", "#EFF8FA"], [0, 1], 16.7, 19.9, -2.4, -2.9).s().p("AAQAlQgMgEgNgOQgNgOgHgPQgHgPAEgIQAEgIAMAFQANAEAMAOQAOAOAHAOQAHAQgEAIQgDAFgGAAIgIgCg");
        this.shape_3.setTransform(64.2, 32.3);

        this.shape_4 = new cjs.Shape();
        this.shape_4.graphics.lf(["#CDDEE6", "#E8F5F8"], [0, 1], 17, 20.3, -2.5, -3).s().p("AARAmQgNgFgNgNQgOgPgGgOQgHgRAEgIQAEgIAMAFQANAEANAPQAOAOAGAOQAHAQgEAJQgCAFgGAAIgIgCg");
        this.shape_4.setTransform(64.2, 32.3);

        this.shape_5 = new cjs.Shape();
        this.shape_5.graphics.lf(["#C9DDE5", "#E2F2F6"], [0, 1], 17.4, 20.8, -2.5, -3).s().p("AARAnQgNgFgNgOQgOgPgHgPQgHgQAEgIQADgIANAEQAOAFANAOQAOAPAHAPQAHAPgEAJQgDAFgGAAIgIgBg");
        this.shape_5.setTransform(64.3, 32.4);

        this.shape_6 = new cjs.Shape();
        this.shape_6.graphics.lf(["#C4DCE5", "#DBF0F5"], [0, 1], 17.7, 21.1, -2.6, -3.1).s().p("AASAnQgNgEgOgPQgOgPgHgPQgIgQAEgJQAFgIANAFQANAEANAPQAPAOAHAQQAHAQgEAJQgDAFgGAAIgIgCg");
        this.shape_6.setTransform(64.3, 32.4);

        this.shape_7 = new cjs.Shape();
        this.shape_7.graphics.lf(["#C0DBE5", "#D5EDF3"], [0, 1], 18.1, 21.5, -2.6, -3.2).s().p("AASAoQgNgEgOgPQgPgQgHgPQgIgRAEgIQAFgJANAFQAOAFANAPQAPAPAHAPQAIARgFAIQgCAGgHAAIgIgCg");
        this.shape_7.setTransform(64.4, 32.4);

        this.shape_8 = new cjs.Shape();
        this.shape_8.graphics.lf(["#BCDAE5", "#CEEAF2"], [0, 1], 18.4, 21.9, -2.7, -3.2).s().p("AASApQgNgFgOgPQgPgPgIgQQgHgRAEgJQAEgJAOAFQANAFAOAPQAPAPAIAQQAHARgEAJQgDAGgGAAQgEAAgFgCg");
        this.shape_8.setTransform(64.5, 32.5);

        this.shape_9 = new cjs.Shape();
        this.shape_9.graphics.lf(["#B7D9E5", "#C8E8F0"], [0, 1], 18.7, 22.3, -2.8, -3.3).s().p("AATAqQgOgFgOgQQgQgQgHgQQgIgRAEgJQAEgJAOAFQAOAFAOAQQAQAQAHAQQAIARgEAJQgDAGgHAAQgDAAgFgCg");
        this.shape_9.setTransform(64.5, 32.5);

        this.shape_10 = new cjs.Shape();
        this.shape_10.graphics.lf(["#B3D8E5", "#C1E5EF"], [0, 1], 19.1, 22.8, -2.8, -3.3).s().p("AATAqQgOgFgOgQQgQgPgIgRQgIgSAFgJQAEgIAOAFQAOAFAPAPQAPAQAIARQAIASgFAJQgDAFgGAAQgEAAgFgCg");
        this.shape_10.setTransform(64.6, 32.6);

        this.shape_11 = new cjs.Shape();
        this.shape_11.graphics.lf(["#AED8E5", "#BAE3EE"], [0, 1], 19.4, 23.1, -2.8, -3.4).s().p("AATArQgPgFgOgQQgPgQgIgRQgJgSAFgJQAEgJAPAFQAOAFAPAQQAPAQAJARQAHASgEAJQgDAGgHAAQgEAAgFgCg");
        this.shape_11.setTransform(64.7, 32.6);

        this.shape_12 = new cjs.Shape();
        this.shape_12.graphics.lf(["#AAD7E5", "#B4E0EC"], [0, 1], 19.7, 23.5, -2.9, -3.5).s().p("AATAsQgOgGgPgQQgQgQgIgSQgIgRAEgKQAFgJAOAFQAPAGAPAPQAQARAIARQAIASgFAJQgDAHgHAAIgJgCg");
        this.shape_12.setTransform(64.7, 32.7);

        this.shape_13 = new cjs.Shape();
        this.shape_13.graphics.lf(["#A5D6E5", "#ADDEEB"], [0, 1], 20, 23.9, -3, -3.5).s().p("AAUAsQgPgFgPgRQgRgQgIgSQgIgSAFgKQAEgJAPAFQAPAFAPARQAQARAJARQAIATgFAJQgDAGgHAAQgEAAgFgCg");
        this.shape_13.setTransform(64.8, 32.7);

        this.shape_14 = new cjs.Shape();
        this.shape_14.graphics.lf(["#A0D5E5", "#A6DBE9"], [0, 1], 20.4, 24.3, -3, -3.6).s().p("AAUAuQgPgGgPgRQgRgRgIgSQgJgTAFgJQAFgKAPAGQAPAFAPARQARARAIARQAJATgFAKQgDAGgHAAQgEAAgGgBg");
        this.shape_14.setTransform(64.8, 32.8);

        this.shape_15 = new cjs.Shape();
        this.shape_15.graphics.lf(["#9CD5E5", "#A0D9E8"], [0, 1], 20.7, 24.7, -3, -3.6).s().p("AAVAuQgQgFgQgRQgRgSgIgSQgJgTAFgKQAFgJAPAFQAPAFARASQARARAIASQAIATgFAKQgCAGgIAAIgJgCg");
        this.shape_15.setTransform(64.9, 32.8);

        this.shape_16 = new cjs.Shape();
        this.shape_16.graphics.lf(["#97D4E5", "#99D6E7"], [0, 1], 21.1, 25.1, -3.1, -3.7).s().p("AAVAvQgQgFgQgSQgRgSgJgSQgIgUAFgKQAEgJAQAFQAPAFARASQARASAIASQAJAUgFAKQgDAGgHAAQgEAAgGgCg");
        this.shape_16.setTransform(65, 32.8);

        this.shape_17 = new cjs.Shape();
        this.shape_17.graphics.f("#92D4E5").s().p("AAVAwQgQgGgQgSQgRgSgJgSQgJgUAFgKQAFgKAQAFQAQAGAQASQASASAIASQAJAUgFAKQgDAHgIAAQgEAAgGgCg");
        this.shape_17.setTransform(65, 32.9);

        this.shape_18 = new cjs.Shape();
        this.shape_18.graphics.lf(["#447EA3", "#75C8DC"], [0, 1], 40.8, 54.2, -9.7, -12.9).s().p("AhiDUIAEgJIADAAIADABIgEAJgAAFDHIAGgDIABANIgHABgAhIDBIgBgBIgBAAIgDgCIgBgCIgBgDIABgEIACgGIAFgIIADgCIADgBIACgBIACAAIACABIABABIACABIABACIAAACIAAAFIgCAFIgDAFIgDAEIgDACIgCABIgCABgAhBCoIgCABIgDAGIgDAHIAAADIAAABIACABIACAAIACgBIACgCIADgFIABgDIABgFIgBgCIgBgBgAASC8IgDgBIgCgCIgBgDIAAgDIABgCIAFABIAAACIAAACIABABIABABQABAAAAAAQAAAAAAAAQABAAAAAAQAAAAAAAAIACgBIABgBIABgCIABgBIAAgDIAAgBIgBgBIgBgBIgCAAIgBABIgBAAIgFgBIAIgPIAOAEIgCAFIgLgDIgDAGIABgBIABAAIACAAIACAAIADACIACADQAAAAAAAAQAAABAAAAQAAAAAAABQAAAAAAAAIgBAFIgCADIgCACIgDABIgDABgAhfC7IgBgBIgBAAIgCgBIgBgBIgBgCIAAgEIABgDIAFAAIAAACIAAACIAAACIACABQAAAAABAAQAAAAAAAAQAAAAABAAQAAAAAAAAIACAAIACgDIABgCIAAgBIgBgBIgEgBIACgFIACAAIAAABIACAAIABgBIABgBQAAAAAAAAQAAAAABAAQAAAAAAAAQAAgBAAAAIAAgBIAAgBIgBgBIgDgBIgBAAIgCACIgBACIgFgBIABgDIAFgEIADgBIAEAAIADABIACACIABADIAAACIgBACIgBACIgCACIgBABIgCAAIgBAAIACABIABABIAAADIgBADIgEAEIgCABIgCABgAgLC0IACgEIACgBIADgCIAEgDIACgBIAGgDIABgCIABgCIAAgCIgBgBIgCAAIgCAAIgCABIgCADIAAABIgEgBIACgEIABgCIACgCIAEgBIAEABIABAAIABAAIABABIACABIABACIAAADIgBADIgCACIgCACIgDADIgEACIgCAAIgCABIgBAAIgBACIAKACIgCAGgABoCNIAFgFIAGAIIgFAFgAiMCVIgDgBIgCgCIAAgDIAAgCIAAgCIAGABIgBABIAAABIABACIACABIACAAIABgBIACgCIABgBIAAgBIABgCIAAgCIgCgCIgCAAIgCAAIgBABIgFgBIAIgOIAPADIgCAFIgMgDIgDAGIABgBIACAAIABAAIADAAIADACIABACIAAAEIgBADIgBAEIgFAEIgEAAgAigCRIgBgBIgBAAIgBgBIgBgBIgDgGIABgFIAFACIgBAEIABACIACABIACAAIACgBIABgBIABgDIAAgCIAAgBIgCgBIgCAAIACgEIABAAIAEAAIABgBIABgCIAAgBIAAgBIgBgBIgBgBIgCAAIgBABIgCAAIgBADIgFgBIABgCIACgDIACgCIAEgBIAEAAIADACIACACIABACIAAACIgCAFIgDACIgCAAIgBAAIAAAAIABABIABACIABACIgBADIgCADIgCACIgCABIgCABgABSCEIgBgBIgBAAIgCgBIgBAAIgBgCIgBgEIABgDIACgGIADgFIAFgGIADgBIACAAIACAAIABAAIABAAIADACIABACIAAADIAAAEIgFAKIgDAEIgDACIgCABIgCABgABaBsIgCABIgCACIgFAKIAAADIAAACIACABIACAAIACgCIACgCIADgEIACgGIAAgCIgBgCIgBgCgAAzB7IAAgBIADgEIADgCIAFgCIAHgDIACgCIABgCIABgCIgBgBIgBgBIgBAAIgCAAIgCAAIgCAEIgFgCIAAgBIADgEIADgCIADgBIAEAAIABABIACAAIABACIABABIABACIAAACIgBAEIgBACIgCACIgDACIgFABIgCACIgCAAIgDACIAMADIgCAFgAigBJIgBgBIgCgBIgCgDIgBgDIADgJIADgGIADgDIACgCIADgCIAFAAIABABIABAAIACACIABACIAAADIAAAEIgFALIgDADIgDACIgCABIgCABgAiXAxIgCABIgCACIgCADIgDAHIAAADIAAACIACABQABAAAAAAQAAAAAAAAQABAAAAAAQAAAAAAAAIACgCIAFgHIACgFIAAgDIgBgCIgBAAIgCgBIAAABgAi0BDIADgHIgFgBIAAgFIAHACIAEgKIgLAIIAAgEIAOgKIAGABIgIAQIADABIgCAEIgDAAIgDAGgACGAyQAAAAgBAAQAAAAgBAAQAAgBAAAAQgBAAAAAAIgCgCIgBgDIABgEIAFAAIAAADIABABIACACIACAAIADgDIAAgBIABgBIABgCIAAgCIgBgCIgCAAIAAgBIgCABIgBAAIgBABIgFgCIAIgNIAPADIgCAFIgMgDIgDAGIABgBIABAAIAEAAIADABIACADIAAAEIgBADIgBADIgDADIgDABIgDABgACuAtIADgGIAEAAIgDAHgABwArIAIgTIgFgBIABgDIABAAIACABIADgBIACgBIABgCIAEABIgMAbgAiNgQIgDgCIgCgCIgBgCIABgGIAFACIAAADIABABIABABIADAAIABgBIACgBIAAgBIABgCIABgCIgBgCIAAgBIgCgBIgCAAIgBABIgBAAIgFgBIAIgOIAPAEIgCAEIgMgCIgDAFIABAAIABgBIAEAAIADACQABAAAAABQAAAAAAAAQABAAAAABQAAAAAAABIAAADIgBAEIgEAFIgDACIgDABgAiggWIACgHIgLgCIACgFIATgNIAFABIgHARIADAAIgCAEIgDAAIgDAGgAiigiIAGABIAFgKgACmgoIgBAAIgBAAIgDgCIgBgDIgBgDIABgDIACgGIADgFIAFgGIADgBIACAAIACAAIABAAIABAAIADACIABACIAAADIAAAEIgFAKIgDAEIgDADIgCABIgCAAgACthAIgBABIgCADIgCACIgDAIIAAACIAAACIACABIACAAIACgCIACgCIADgFIACgFIAAgCIgBgDIgBgBgACOgvIAJgTIgGgBIACgDIAAAAIACAAIAEgBIABgBIACgCIAEABIgMAbgAhShlIgBgBIgBAAIgDgBIgBgCIgBgEIABgDIACgGIADgFIACgEIADgCIADgBIACAAIACAAIABAAIABAAIADACIABACIAAADIAAAEIgCAGIgDAEIgGAGIgCABIgDABgAhLh9IgCABIgEAHIgBADIgBAFIAAACIACABIACAAIACgCIADgEIADgIIABgCIgBgCIgBgCgAhphqIgEgCIgBgDIgBgCIABgFIAFABIAAACIAAACIABABIABABQABAAAAAAQAAAAAAAAQAAAAABAAQAAAAAAAAIACgBIABgBIABgCIABgBIAAgDIAAgBIgBgBIgBgBIgCAAIgCABIgGgBIAIgPIAPAEIgCAFIgLgDIgDAGIACgBIACAAIACAAQABAAAAABQABAAAAAAQAAAAAAAAQABABAAAAIACADIAAACIgBAFIgCADIgCACIgDABIgDACgACNh6IgDgBIgCgDIAAgCIAAgCIAAgCIAGABIgBABIAAABIABABQAAABAAAAQAAAAABAAQAAAAAAAAQAAAAABAAIACAAIADgCIABgBIAAgBIABgCIAAgDIgBgBIgCgBIgBAAIgCABIgBABIgFgCIAIgNIAPADIgCAFIgMgDIgDAGIABAAIACgBIAEAAIADACIABACIAAAEIgBADIgBADIgDADIgCACIgEABgAh0iVIAFgGIAJAMIgGAFgAgDidIgDgCIgCgCIgBgDIAAgCIABgCIAFABIAAABIAAACIABABIABABIABAAIACgBIABgCIABgBIABgBIABgCIgBgCIAAgBIgCgBIgCAAIgBAAIAAABIgFgBIAHgOIAPADIgDAFIgLgDIgDAGIABAAIABAAIAEAAIADABIACACIAAAEIgDAGIgCADIgDACIgDABgAgYijQgBAAAAAAQgBAAAAAAQgBgBAAAAQgBAAAAgBIgCgBIAAgDIAAgDIAAgCIAGABIgBACIAAACIABABIACABQAAAAAAAAQAAAAABAAQAAAAAAAAQABAAAAAAIADgCIABgCIAAgBIABgDIAAgBIgBgBIgBgBIgEAAIgBABIgFgBIAIgPIAPAEIgCAFIgLgDIgEAGIABgBIACAAIABAAIADAAIADACIABACIABADIgDAIIgDACIgCABIgEABgAgKjTIAGgBIAAALIgGACgABcjNIgCgCIABgCIAFACIgBACg");
        this.shape_18.setTransform(32.8, 56.7);

        this.shape_19 = new cjs.Shape();
        this.shape_19.graphics.f("#2F5D91").s().p("AADARIgDgBIgBgCIgBgDIAAgCIABgDIAEACIAAABIAAACIABABIABABIACAAIADgBIABgCIABgBIAAgBIABgCIgBgCIAAgBIgBgBIgCAAIgCAAIgBABIgFgBIAIgNIAPADIgCAFIgLgDIgEAGIABAAIACgBIADAAIADABIACACIABAEIgEAGIgCADIgCACIgEABgAgRAMQgBAAAAAAQgBAAAAgBQgBAAAAAAQAAAAgBgBIgCgCIAAgCIAAgDIAAgCIAGABIAAACIAAABIABACIABAAQAAAAAAABQABAAAAAAQAAAAAAAAQABgBAAAAIADgCIABgBIABgBIAAgDIAAAAIgBgCIgBAAIgDAAIgBABIgGgCIAIgOIAOAEIgCAFIgKgDIgDAGIAAgBIACAAIABAAIADAAIADACIABACIABACIgDAHIgCADIgDABIgDABg");
        this.shape_19.setTransform(32.1, 39.1);

        this.shape_20 = new cjs.Shape();
        this.shape_20.graphics.f("#2F5D91").s().p("AAGASIgBgBIgBAAIgDgCIgBgCIAAgDIAAgEIACgFIADgEIACgEIADgCIADgBIACgBIACAAIABABIABAAIADACIABACIAAADIAAADIgCAFIgDAFIgGAGIgCABIgDABgAANgFIgCABIgEAGIgBACIgBAGIAAACIACABIACgBIACgBIADgEIADgHIABgDIgBgCIgBgBgAgQAMIgEgBIgBgDIgBgCIABgFIAFABIAAACIAAABIABACIABAAQABAAAAABQAAAAAAAAQAAAAABAAQAAgBAAAAIACAAIABgCIABgBIABgBIAAgDIAAAAIgBgCIgBAAIgCAAIgCABIgGgBIAIgPIAOAEIgCAFIgKgDIgDAGIACgBIACAAIACAAQABAAAAAAQABAAAAABQAAAAAAAAQABAAAAABIACACIAAACIgBAEIgCADIgCADIgDABIgDABg");
        this.shape_20.setTransform(23.9, 44.7);

        this.shape_21 = new cjs.Shape();
        this.shape_21.graphics.f("#2F5D91").s().p("AAEAQIgEgBIAAgCIgBgDIABgFIAEACIAAADIAAABIACABIACAAIACgBIABgCIABgBIAAgBIABgCIAAgCIgBgBIgBgBIgCAAIgBAAIgCABIgFgBIAIgNIAPADIgCAFIgLgDIgEAGIABAAIACgBIAEAAIADACQAAAAAAAAQABAAAAAAQAAAAAAABQAAAAAAAAIABAEIgBADIgEAGIgDACIgDABgAgPALIADgHIgLgCIACgEIASgOIAFACIgHAPIADABIgCAEIgDAAIgCAGgAgRgBIAHABIAFgKg");
        this.shape_21.setTransform(18.2, 53.3);

        this.shape_22 = new cjs.Shape();
        this.shape_22.graphics.f("#2F5D91").s().p("AAFARIgBgBIgCAAIgCgEIAAgDIACgJIADgEIADgEIACgCIADgBIAFAAIABAAIABABIACABIABACIAAADIAAAEIgFAJIgDAEIgDACIgCABIgCABgAAOgHIgCACIgCACIgCACIgDAHIAAACIAAACIACABQABABAAAAQAAAAAAAAQABAAAAAAQAAAAAAgBIACgBIACgCIADgFIACgEIAAgCIgBgDIgBgBIgCAAIAAAAgAgOAKIADgFIgLgDIACgEIASgOIAFACIgHAPIADABIgCAFIgDgBIgDAGgAgQgBIAHABIAEgJg");
        this.shape_22.setTransform(16.2, 62.3);

        this.shape_23 = new cjs.Shape();
        this.shape_23.graphics.f("#2F5D91").s().p("AAEARIgEgBIgBgCIAAgDIAAgCIAAgDIAFACIAAABIAAABIABACIABABIACAAIABgBIACgCIABgBIABgBIAAgCIAAgCIgCgCIgCAAIgCAAIgBABIgFgBIAIgOIAPAEIgCAFIgLgDIgEAGIABgBIACAAIACAAIACAAIADABIABACIAAADIgBAEIgBADIgFAFIgEAAgAgPAMIgCAAIgBAAIgBgBIgCgBIgBgBIgBgDIAAgDIACgDIAEABIgBAEIABABIADABIACAAIABAAIABgBIABgDIAAgCIAAgBIgCAAIgCAAIACgFIABABIAEAAIABgBIABgCIABgBIgBgBIAAgBIgCgBIgCAAIgBAAIgCABIgBADIgFgBIABgDIACgCIADgCIADgBIAEAAIADACIABABIABADIAAACIgBAEIgDACIgBABIgCAAIAAAAIACABIABABIAAACIgBADIgBADIgDACIgCABIgCAAg");
        this.shape_23.setTransform(18.4, 69.9);

        this.shape_24 = new cjs.Shape();
        this.shape_24.graphics.f("#2F5D91").s().p("AAGARIgBAAIgBAAIgDgCIgBgCIAAgDIAAgEIACgGIAFgHIADgDIADgBIACAAIACAAIACABIABAAIACABIABADIAAACIAAAEIgCAFIgDAFIgDAEIgDACIgCABIgCAAgAANgGIgCABIgDAFIgDAHIAAACIAAACIACABIACAAIACgBIACgCIADgFIABgDIABgEIgBgCIgBgBgAgQAMIgBgBIgBAAIgCgBIgBgCIgBgCIAAgDIABgDIAFAAIAAACIAAACIAAACIACABQAAAAABAAQAAAAAAAAQAAAAABAAQAAAAAAAAIACgBIACgCIABgCIAAgBIgBgBIgEgBIACgEIACAAIAAABIACAAIABgBIABgBQAAAAAAAAQAAAAABAAQAAAAAAgBQAAAAAAAAIAAgBIAAgBIgBgCIgDgBIgBABIgCABIgBADIgFgCIABgCIAFgEIADgBIAEAAIADABIABACIABACIAAADIgBACIgBACIgBABIgBABIgCAAIgBABIACABIABAAIAAADIgBADIgEAEIgCABIgCABg");
        this.shape_24.setTransform(24.9, 74.2);

        this.shape_25 = new cjs.Shape();
        this.shape_25.graphics.f("#2F5D91").s().p("AAFARIgDgBIgCgDIAAgCIAAgDIAAgCIAFABIAAACIAAABIAAACIACAAQAAAAABABQAAAAAAAAQAAAAABAAQAAgBAAAAIACAAIABgCIABgBIABgBIAAgDIAAgBIgBgCIgBAAIgCAAIgCAAIgBABIgEgBIAIgOIAOAEIgCAFIgLgDIgEAGIABgBIACAAIACAAIACAAIADABIACACQAAABAAAAQAAAAAAABQAAAAAAAAQAAABAAAAIgCAEIgBADIgDADIgCABIgEABgAgYAJIACgEIACgCIACgCIAFgBIADgBIAFgCIABgBIABgCIAAgCIAAgCIAAgBIgCAAIgCAAIgCABIgCACIAAABIgGgBIADgDIACgDIACgBIAEgBIADAAIABAAIABABIABABIACABIABACIAAADIgBADIgCACIgBACIgDABIgFACIgCABIgBABIgCAAIgBACIALACIgCAFg");
        this.shape_25.setTransform(34.1, 73.8);

        this.shape_26 = new cjs.Shape();
        this.shape_26.graphics.f("#2F5D91").s().p("AAHARIgBAAIgBAAIgCgBIgBgBIgBgCIgBgDIABgEIACgGIADgEIAFgGIADgBIACAAIACAAIABAAIABAAIADACIABACIAAADIAAAEIgFAKIgDADIgDADIgCABIgCAAgAAPgGIgCABIgCACIgFAKIAAACIAAACIACABIACAAIACgBIACgCIADgFIACgFIAAgCIgBgCIgBgBgAgXAJIAAgBIADgFIADgCIAFgBIAHgDIACgCIABgBIABgCIgBgCIgBgBIgBAAIgCAAIgCABIgCADIgFgBIAAgBIADgFIADgCIADAAIAEAAIABAAIABABIABABIABABIABACIAAACIgBAEIgBACIgBACIgDABIgFACIgCABIgCAAIgDACIAMADIgCAFg");
        this.shape_26.setTransform(40.3, 68.2);

        this.shape_27 = new cjs.Shape();
        this.shape_27.graphics.f("#2F5D91").s().p("AABAQQgBAAAAAAQAAAAAAAAQAAAAgBgBQAAAAgBAAIgBgCIgBgDIABgEIAEABIAAADIABABIABABIACAAIAEgCIAAgCIABgBIABgCIAAgCIgBgBIgCgBIAAAAIgCAAIgBAAIgBABIgEgBIAGgNIAPADIgBAFIgMgDIgEAGIABAAIACgBIAEAAIADACIACABIAAAEIgBADIgCADIgCADIgDACIgDABgAgVAKIAJgSIgFgBIABgEIABAAIABABIAEgBIACgBIABgCIAEABIgMAag");
        this.shape_27.setTransform(46.1, 60.1);

        this.shape_28 = new cjs.Shape();
        this.shape_28.graphics.f("#2F5D91").s().p("AADARIgBgBIgBAAIgCgCIgBgCIgBgDIABgEIACgFIACgEIAFgGIADgBIADgBIABAAIABABIABAAIADACIABACIABADIgBAEIgFAJIgCAEIgDACIgDABIgCABgAALgGIgCABIgCACIgCADIgCAGIgBADIABACIACABIABAAIACgCIACgCIADgFIACgEIAAgDIgBgCIgBgBgAgUAKIAJgSIgFgCIABgDIABAAIABABIAEgBIACgBIABgCIAEABIgMAag");
        this.shape_28.setTransform(49.1, 50.9);

        this.shape_29 = new cjs.Shape();
        this.shape_29.graphics.f("#2F5D91").s().p("AhhDkIALgYIACABIADABIgLAXgAAMDIIAHgCIABAVIgHADgAi0CrIATgRIADAFIgTARgABvCOIAFgEIAIAKIgFAEgAjUBGIAWgIIAAAHIgWAHgAC2AuIACgGIAIACIgCAGgAi9gsIADgGIAUAEIgDAHgADNhDIAIgDIAAAGIgHADgAhxiZIAGgEIAMAPIgGAFgACuidIAPgPIADAGIgPANgAgEjcIAGgCIABAXIgGACgABkjMIgDgBIALgXIAFABIgLAYg");
        this.shape_29.setTransform(32.1, 56.6);

        this.shape_30 = new cjs.Shape();
        this.shape_30.graphics.f("#2F5D91").s().p("AgHAPIgCgCIgCgCIgBgDIAAgCIABgCIAFABIgBACIAAABIABABQAAAAABAAQAAABAAAAQAAAAAAAAQABAAAAAAIACAAIACgCIABgBIAAgBIABgDIAAgCIgBgBIgBAAIgBAAIgBAAIgCAAIgFAAIAJgOIANAEIgCAEIgLgDIgCAHIABgBIABAAIADAAIADABIACACIAAADIgBAEIgCACIgDADIgCACIgCABg");
        this.shape_30.setTransform(47.7, 43);

        this.shape_31 = new cjs.Shape();
        this.shape_31.graphics.lf(["#B5383E", "#783C3D"], [0, 1], -0.9, 2.5, 3.2, -6.7).s().p("AgTAvIAIgVIAAgFQABgDAEgCIAXhAIADABIgWBAQACADgBAEIgDAEIgHAVg");
        this.shape_31.setTransform(39.1, 44.8);

        this.shape_32 = new cjs.Shape();
        this.shape_32.graphics.lf(["#B5383E", "#783C3D"], [0, 1], -16.5, 2.2, 13, -1.4).s().p("AiJAIIEUgcIAAAGIi7AVQgCAEgFAFQgFADgFAAQgEABgDgDIgFgGIg9AKg");
        this.shape_32.setTransform(37.6, 58.1);

        this.shape_33 = new cjs.Shape();
        this.shape_33.graphics.f("#AE9FB6").s().p("AgTAvIAIgWQgBAAAAgBQAAAAAAgBQAAAAAAgBQAAAAABgBQACgFADAAIAXhAIADAAIgWBCQACACgBAEQAAABAAAAQgBABAAAAQAAABgBAAQAAAAgBABIgHAVg");
        this.shape_33.setTransform(39.3, 45.2);

        this.shape_34 = new cjs.Shape();
        this.shape_34.graphics.lf(["#B5383E", "#FFFFFF"], [0, 1], 0, -3, 0.1, 1.7).s().p("AiIgCIA8gDQAIgJAFAAQAEgBAFACQAEADACAFIC7gSIAAALIi7AVQgDAEgEAFQgFADgFAAQgEABgEgDIgEgGIg9AKg");
        this.shape_34.setTransform(37.6, 57.9);

        this.shape_35 = new cjs.Shape();
        this.shape_35.graphics.f("#AE9FB6").s().p("AiIgCIA7gDIAHgGQADgDAEgBQAFAAAEADQAFADABAEIC7gSIgBALIi7AVQgCAFgEAEQgGADgEABQgEAAgDgDIgGgFIg8AKg");
        this.shape_35.setTransform(38.1, 58.5);

        this.shape_36 = new cjs.Shape();
        this.shape_36.graphics.f("#325A7C").s().p("AgXBFIgBAAIAFgMIAAAAIABAAIgEAMgAAHA4IABAAIACAMIgCAAgAgzAzIAKgJIABABIgKAJgAAhApIABgCIAIAJIgCABgAhAAUIALgEIABACIgMADgAAyAOIAAgBIABAAIAKACIgBACgAg8gOIABgBIAAgBIALADIgBABIAAABgAA1gRIAMgDIAAACIgMADgAgogvIACgBIAHAIIgCACgAAqgqIAJgJIABABIgJAJgAgJhDIABAAIADAMIgDABgAAUg4IgBAAIAFgMIABAAIAAAAIgEANg");
        this.shape_36.setTransform(38.5, 47.5);

        this.shape_37 = new cjs.Shape();
        this.shape_37.graphics.f("#FFFFFF").s().p("AgFAVIiMgJICMgGIAQisIgBCyICIAEIiPAHIgICPg");
        this.shape_37.setTransform(47.9, 20.8);

        this.shape_38 = new cjs.Shape();
        this.shape_38.graphics.f("#FFFFFF").s().p("AgDAOIhfgGIBfgEIALhzIgBB3IBcADIhhAFIgFBhg");
        this.shape_38.setTransform(44.7, 23.5);

        this.shape_39 = new cjs.Shape();
        this.shape_39.graphics.f("#FAFDFF").s().p("AgKgDQAHgLAPAGIgGATQgXgDAHgLg");
        this.shape_39.setTransform(46.7, 22.1);

        this.shape_40 = new cjs.Shape();
        this.shape_40.graphics.f("#F1F8FA").s().p("AgMgDQAHgMATAHQgFAMgBAIQgbgFAHgKg");
        this.shape_40.setTransform(46.5, 22.1);

        this.shape_41 = new cjs.Shape();
        this.shape_41.graphics.f("#E8F3F7").s().p("AgOgEQAHgMAYAIQgGAPgBAFQgfgFAHgLg");
        this.shape_41.setTransform(46.3, 22);

        this.shape_42 = new cjs.Shape();
        this.shape_42.graphics.f("#E0EFF4").s().p("AgQgFQAHgMAcAJQgGAOgBAHQgkgGAIgMg");
        this.shape_42.setTransform(46, 22);

        this.shape_43 = new cjs.Shape();
        this.shape_43.graphics.f("#D8EBF1").s().p("AgTgFQAIgNAgAKIgEAKQgCAFgBAGQgogHAHgLg");
        this.shape_43.setTransform(45.8, 21.9);

        this.shape_44 = new cjs.Shape();
        this.shape_44.graphics.f("#CFE7EE").s().p("AgVgGQAIgNAkALQgGAPgBAHQgtgIAIgMg");
        this.shape_44.setTransform(45.6, 21.9);

        this.shape_45 = new cjs.Shape();
        this.shape_45.graphics.f("#C7E3EC").s().p("AgXgGQAIgOAoAMQgFANgBAJQgygIAIgMg");
        this.shape_45.setTransform(45.3, 21.8);

        this.shape_46 = new cjs.Shape();
        this.shape_46.graphics.f("#BFDFE9").s().p("AgZgHQAIgOAtANQgHAQAAAHQg2gJAIgNg");
        this.shape_46.setTransform(45.1, 21.7);

        this.shape_47 = new cjs.Shape();
        this.shape_47.graphics.f("#B7DBE7").s().p("AgbgHQAIgOAxANQgGAOgBAKQg7gKAJgNg");
        this.shape_47.setTransform(44.9, 21.7);

        this.shape_48 = new cjs.Shape();
        this.shape_48.graphics.f("#AED8E5").s().p("AgegIQAJgOA1AOQgGAPgBAJQhAgLAJgNg");
        this.shape_48.setTransform(44.7, 21.6);

        this.shape_49 = new cjs.Shape();
        this.shape_49.graphics.f("#A6D4E2").s().p("AgggJQAJgPA5AQQgGAPgBAKQhEgMAJgOg");
        this.shape_49.setTransform(44.4, 21.6);

        this.shape_50 = new cjs.Shape();
        this.shape_50.graphics.f("#9ED1E0").s().p("AgigJQAJgPA9AQQgGAPgBALQhIgNAJgOg");
        this.shape_50.setTransform(44.2, 21.6);

        this.shape_51 = new cjs.Shape();
        this.shape_51.graphics.f("#96CEDE").s().p("AglgKQAKgPBBARQgGANgBANQhNgNAJgPg");
        this.shape_51.setTransform(44, 21.9);

        this.shape_52 = new cjs.Shape();
        this.shape_52.graphics.f("#8DCADC").s().p("AgngKQAKgQBFASQgGAQgBALQhRgOAJgPg");
        this.shape_52.setTransform(43.7, 21.8);

        this.shape_53 = new cjs.Shape();
        this.shape_53.graphics.f("#85C7D9").s().p("AgpgKQAKgRBKATQgGAQgBALQhXgOAKgPg");
        this.shape_53.setTransform(43.5, 21.8);

        this.shape_54 = new cjs.Shape();
        this.shape_54.graphics.f("#7DC4D7").s().p("AgrgLQAKgRBOAUQgGAOgCAOQhagQAKgPg");
        this.shape_54.setTransform(43.3, 21.8);

        this.shape_55 = new cjs.Shape();
        this.shape_55.graphics.f("#74C1D5").s().p("AgtgMQAKgRBSAVIgFANQgCAGAAAKQhggRALgQg");
        this.shape_55.setTransform(43, 21.7);

        this.shape_56 = new cjs.Shape();
        this.shape_56.graphics.f("#2B3031").s().p("Ah0DlQg/g6gDhgQgChgA9hVQA5hSBXgfQBXgfBLAfQhLgchUAgQhUAgg5BPQg9BWADBgQACBgBAA5IAIAEg");
        this.shape_56.setTransform(27.7, 55.5);

        this.shape_57 = new cjs.Shape();
        this.shape_57.graphics.f("#FFFFFF").s().p("AhYABQAtgqA6gWQA6gXArAIQAbAQgBAfQhAgChUAjQhNAhg6AuQAKgnArgpg");
        this.shape_57.setTransform(32, 46);

        this.shape_58 = new cjs.Shape();
        this.shape_58.graphics.f("#FEFDFE").s().p("AhbgBQAugtA6gWQA8gXAsALQAbAQABAiQhBABhXAkQhOAhg7AsQAKgsArgpg");
        this.shape_58.setTransform(32.1, 46.2);

        this.shape_59 = new cjs.Shape();
        this.shape_59.graphics.f("#FDFCFD").s().p("AhegDQAugvA7gWQA+gXAtAOQAcATABAiQhCAEhYAkQhPAhg9ArQALgyAqgpg");
        this.shape_59.setTransform(32.2, 46.4);

        this.shape_60 = new cjs.Shape();
        this.shape_60.graphics.f("#FCFAFC").s().p("AiFAqQAOgcAWgVQAugwA9gWQA+gXAvARQAdATADAmQhEAGhaAlQhRAhg+ApQAEgYANgZg");
        this.shape_60.setTransform(32.3, 46.6);

        this.shape_61 = new cjs.Shape();
        this.shape_61.graphics.f("#FBF9FB").s().p("AiIAqQAOgeAWgVQAwgzA8gWQBAgWAwATQAfAVACAnQhFAKhcAlQhRAhhAAnQAFgZAMgbg");
        this.shape_61.setTransform(32.3, 46.8);

        this.shape_62 = new cjs.Shape();
        this.shape_62.graphics.f("#FAF8FB").s().p("AiLArQAPggAVgWQAvg1A/gWQBBgWAxAVQAhAYADApQhGAMhfAlQhRAhhDAmQAEgbANgcg");
        this.shape_62.setTransform(32.4, 47);

        this.shape_63 = new cjs.Shape();
        this.shape_63.graphics.f("#F9F7FA").s().p("AiOAsQAOgiAVgYQAxg3A/gVQBCgWAzAYQAhAZAEArQhHAPhgAmQhTAhhDAkQADgcANgeg");
        this.shape_63.setTransform(32.5, 47.1);

        this.shape_64 = new cjs.Shape();
        this.shape_64.graphics.f("#F9F6F9").s().p("AiRAsQAOgkAVgYQAxg5BBgVQBDgWA1AaQAiAbAEAtQhIARhjAnQhRAghHAjQADgdANggg");
        this.shape_64.setTransform(32.6, 47.3);

        this.shape_65 = new cjs.Shape();
        this.shape_65.graphics.f("#F8F5F8").s().p("AiVAtQAPgmAVgZQAyg7BBgVQBFgWA2AdQAkAcAEAvQhIAThmAoQhQAfhLAjQADgfAMghg");
        this.shape_65.setTransform(32.6, 47.5);

        this.shape_66 = new cjs.Shape();
        this.shape_66.graphics.f("#F7F4F8").s().p("AiYAtQAPgoAVgaQAyg9BDgVQBFgVA4AfQAlAdAFAyQh7AkjUBaQADggAMgjg");
        this.shape_66.setTransform(32.7, 47.7);

        this.shape_67 = new cjs.Shape();
        this.shape_67.graphics.f("#F6F3F7").s().p("AibAuQAOgrAWgaQAyg/BFgVQBGgVA5AiQAmAfAGAzQhFAWhvAsIihA+QADgiAMgkg");
        this.shape_67.setTransform(32.8, 47.8);

        this.shape_68 = new cjs.Shape();
        this.shape_68.graphics.f("#F6F2F7").s().p("AifAuQAPgsAWgbQAyhBBGgVQBHgVA7AlQAnAfAHA3Qg2ASiCAyQh3AtgsAQQACgkAMgmg");
        this.shape_68.setTransform(32.9, 48);

        this.shape_69 = new cjs.Shape();
        this.shape_69.graphics.f("#F5F1F6").s().p("AiiAvQAOgvAXgcQAzhDBGgUQBJgVA8AnQAoAhAIA4QkJBohYAbQACglAMgng");
        this.shape_69.setTransform(33, 48.2);

        this.shape_70 = new cjs.Shape();
        this.shape_70.graphics.f("#F5F0F5").s().p("AilAwQAOgwAWgeQA0hFBIgUQBKgVA+AqQApAjAIA6QheAmhgAlQhrAog+ARQACgmAMgpg");
        this.shape_70.setTransform(33, 48.3);

        this.shape_71 = new cjs.Shape();
        this.shape_71.graphics.f("#F4EFF5").s().p("AipAwQAOgyAXgeQA0hHBJgUQBLgVBAAsQApAkAKA9QhfAphjAlQhrAohAAQQACgoALgrg");
        this.shape_71.setTransform(33.1, 48.5);

        this.shape_72 = new cjs.Shape();
        this.shape_72.graphics.f("#F3EFF4").s().p("AisAxQAOg0AXgfQA1hJBKgUQBMgVBBAvQArAmAJA+QhdArhnAnQhrAnhCAOQAAgoAMgtg");
        this.shape_72.setTransform(33.2, 48.6);

        this.shape_73 = new cjs.Shape();
        this.shape_73.graphics.f("#F3EEF4").s().p("AivAyQAOg2AXggQA1hLBMgUQBNgVBDAyQArAnALBAQhdAuhrAnQhsAnhFANQACgqALgug");
        this.shape_73.setTransform(33.3, 48.8);

        this.shape_74 = new cjs.Shape();
        this.shape_74.graphics.lf(["#DFDCE5", "#DFDCE5", "#FFFFFF"], [0, 0.529, 1], -5.1, -18, 4.9, 17).s().p("AiEDAQg3gygChTQgChSA0hKQA0hIBOgbQBNgbBBAgQA3AyACBTQACBSg1BKQgzBIhOAbQgiAMghAAQgnAAgkgRg");
        this.shape_74.setTransform(33.4, 57.7);

        this.shape_75 = new cjs.Shape();
        this.shape_75.graphics.lf(["#DBD7E2", "#DBD7E2", "#F6F4F6"], [0, 0.529, 1], -5.2, -18.2, 5, 17.2).s().p("AiFDCQg4gygChUQgChUA1hKQA1hJBOgbQBNgaBCAfQA4AyACBUQACBTg1BLQg0BJhPAbQgjAMghAAQgnAAgkgRg");
        this.shape_75.setTransform(33.3, 57.6);

        this.shape_76 = new cjs.Shape();
        this.shape_76.graphics.lf(["#D7D2DE", "#D7D2DE", "#EFECF0"], [0, 0.529, 1], -5.2, -18.4, 5, 17.3).s().p("AiGDEQg5gzgChVQgBhUA1hLQA0hKBQgbQBOgbBDAgQA3AzACBUQACBUg1BMQg0BKhQAbQgjAMgiAAQgnAAgkgRg");
        this.shape_76.setTransform(33.2, 57.5);

        this.shape_77 = new cjs.Shape();
        this.shape_77.graphics.lf(["#D3CDDA", "#D3CDDA", "#E9E5EA"], [0, 0.529, 1], -5.3, -18.6, 5, 17.5).s().p("AiIDGQg4gzgDhWQgBhVA2hMQA1hLBQgbQBPgbBDAgQA4A0ACBVQADBVg2BMQg2BKhQAcQgkAMgiAAQgoAAgkgRg");
        this.shape_77.setTransform(33.1, 57.4);

        this.shape_78 = new cjs.Shape();
        this.shape_78.graphics.lf(["#CFC8D6", "#CFC8D6", "#E2DDE5"], [0, 0.529, 1], -5.3, -18.7, 5.1, 17.7).s().p("AiJDIQg5g0gChWQgDhWA3hNQA1hLBSgcQBPgbBEAgQA5A0ACBWQACBWg2BNQg2BLhRAcQgkAMgiAAQgoAAglgRg");
        this.shape_78.setTransform(32.9, 57.3);

        this.shape_79 = new cjs.Shape();
        this.shape_79.graphics.lf(["#CBC3D2", "#CBC3D2", "#DCD6DF"], [0, 0.529, 1], -5.4, -18.9, 5.1, 17.9).s().p("AiKDKQg6g1gChXQgChWA3hOQA2hMBSgcQBQgbBFAhQA5A0ACBXQACBXg3BNQg2BMhSAcQgkAMgiAAQgpAAglgRg");
        this.shape_79.setTransform(32.8, 57.2);

        this.shape_80 = new cjs.Shape();
        this.shape_80.graphics.lf(["#C7BFCF", "#C7BFCF", "#D7D0DA"], [0, 0.529, 1], -5.4, -19.1, 5.2, 18).s().p("AiMDMQg6g1gChYQgChXA3hPQA3hMBTgdQBRgbBFAhQA6A1ACBXQACBYg3BOQg3BNhTAcQgkAMgjAAQgpAAgmgRg");
        this.shape_80.setTransform(32.7, 57.1);

        this.shape_81 = new cjs.Shape();
        this.shape_81.graphics.lf(["#C3BACB", "#C3BACB", "#D1C9D5"], [0, 0.529, 1], -5.5, -19.3, 5.2, 18.2).s().p("AiNDNQg7g1gChYQgChZA4hPQA3hNBUgcQBSgdBFAiQA7A1ACBZQACBYg4BPQg3BNhTAdQglAMgjAAQgqAAgmgSg");
        this.shape_81.setTransform(32.5, 57);

        this.shape_82 = new cjs.Shape();
        this.shape_82.graphics.lf(["#C0B5C7", "#C0B5C7", "#CCC3D1"], [0, 0.529, 1], -5.5, -19.5, 5.3, 18.3).s().p("AiODPQg7g2gDhZQgChZA5hQQA3hOBVgcQBSgdBGAiQA7A2ADBZQACBZg5BQQg3BOhVAdQglAMgjAAQgqAAgmgSg");
        this.shape_82.setTransform(32.4, 56.9);

        this.shape_83 = new cjs.Shape();
        this.shape_83.graphics.lf(["#BCB1C4", "#BCB1C4", "#C6BCCC"], [0, 0.529, 1], -5.6, -19.6, 5.3, 18.5).s().p("AiQDRQg7g2gDhbQgChaA5hQQA5hPBVgdQBTgcBHAiQA8A2ACBaQACBag5BRQg4BOhVAdQgmAOgkAAQgqAAgngTg");
        this.shape_83.setTransform(32.3, 56.8);

        this.shape_84 = new cjs.Shape();
        this.shape_84.graphics.lf(["#B8ADC1", "#B8ADC1", "#C1B6C7"], [0, 0.529, 1], -5.6, -19.8, 5.4, 18.7).s().p("AiRDTQg8g2gChcQgDhbA6hRQA4hPBXgdQBUgeBHAjQA8A2ADBcQACBag5BSQg5BPhWAdQgmAOgkAAQgrAAgngTg");
        this.shape_84.setTransform(32.2, 56.7);

        this.shape_85 = new cjs.Shape();
        this.shape_85.graphics.lf(["#B5A8BD", "#B5A8BD", "#BCB0C3"], [0, 0.529, 1], -5.7, -20, 5.4, 18.8).s().p("AiTDVQg8g3gDhcQgChcA6hSQA5hQBXgdQBVgdBIAiQA9A3ACBcQADBcg7BSQg5BQhWAdQgmANglAAQgrAAgogSg");
        this.shape_85.setTransform(32.1, 56.6);

        this.shape_86 = new cjs.Shape();
        this.shape_86.graphics.lf(["#B1A4BA", "#B1A4BA", "#B7AABE"], [0, 0.529, 1], -5.7, -20.1, 5.5, 19).s().p("AiUDXQg9g4gChcQgDhdA7hTQA6hRBXgdQBWgeBJAjQA9A4ACBdQADBcg7BTQg6BRhXAdQgnAOgkAAQgsAAgogTg");
        this.shape_86.setTransform(31.9, 56.5);

        this.shape_87 = new cjs.Shape();
        this.shape_87.graphics.lf(["#AEA0B7", "#AEA0B7", "#B2A4BA"], [0, 0.529, 1], -5.8, -20.3, 5.5, 19.2).s().p("AiVDZQg+g4gCheQgDhdA8hUQA6hRBYgeQBXgeBJAjQA+A4ACBeQACBdg7BUQg6BRhYAeQgnAOglAAQgsAAgogTg");
        this.shape_87.setTransform(31.8, 56.4);

        this.shape_88 = new cjs.Shape();
        this.shape_88.graphics.lf(["#AA9CB4", "#AA9CB4", "#AD9FB6"], [0, 0.529, 1], -5.8, -20.6, 5.6, 19.3).s().p("AiWDaQg+g4gDhfQgCheA7hUQA7hSBZgeQBXgfBKAkQA+A5ADBeQACBeg7BUQg7BThZAeQgnAOglAAQgtAAgogUg");
        this.shape_88.setTransform(31.7, 56.4);

        this.shape_89 = new cjs.Shape();
        this.shape_89.graphics.lf(["#A798B1", "#A798B1", "#A899B1"], [0, 0.529, 1], -5.9, -20.7, 5.6, 19.5).s().p("AiYDcQg+g5gDhfQgDhfA9hVQA8hSBZgfQBYgeBKAjQBAA6ACBfQADBfg9BUQg7BUhaAeQgnAOgmAAQgtAAgpgUg");
        this.shape_89.setTransform(31.6, 56.3);

        this.shape_90 = new cjs.Shape();
        this.shape_90.graphics.f("#A494AE").s().p("AiZDeQg/g5gDhgQgChgA9hWQA7hUBbgeQBYgfBMAlQA/A5ADBgQACBgg9BVQg7BUhbAfQgoAOgmAAQgtAAgpgUg");
        this.shape_90.setTransform(31.4, 56.2);

        this.shape_91 = new cjs.Shape();
        this.shape_91.graphics.lf(["#467FA3", "#3B4C61"], [0, 1], -22.5, -7.3, -2.4, -0.8).s().p("AidDeQhMg1gHhnQgIhmBBhbQBChdBkgbQBjgcBMA2QBMA2AIBmQAHBmhBBbQhBBchlAcQghAJgfAAQg9AAgygjg");
        this.shape_91.setTransform(29.2, 54.7);

        this.shape_92 = new cjs.Shape();
        this.shape_92.graphics.lf(["#5284A7", "#435267"], [0, 1], -22.6, -7.3, -2.4, -0.8).s().p("AidDfQhNg2gHhmQgIhnBChcQBBhcBlgbQBjgcBMA1QBNA1AHBoQAIBmhCBbQhBBdhlAcQghAJgfAAQg9AAgygjg");
        this.shape_92.setTransform(29.2, 54.7);

        this.shape_93 = new cjs.Shape();
        this.shape_93.graphics.lf(["#5D89AC", "#4C586C"], [0, 1], -22.6, -7.3, -2.4, -0.7).s().p("AieDfQhMg1gIhnQgHhnBBhcQBChcBlgcQBjgcBNA2QBMA1AIBnQAHBmhBBdQhCBchlAcQghAJgfAAQg9AAgzgjg");
        this.shape_93.setTransform(29.2, 54.6);

        this.shape_94 = new cjs.Shape();
        this.shape_94.graphics.lf(["#678FB0", "#555F72"], [0, 1], -22.7, -7.3, -2.4, -0.7).s().p("AieDgQhNg2gHhnQgIhnBChdQBChcBlgcQBkgbBMA1QBNA2AIBnQAHBmhCBdQhCBdhlAcQghAJggAAQg9AAgygjg");
        this.shape_94.setTransform(29.2, 54.6);

        this.shape_95 = new cjs.Shape();
        this.shape_95.graphics.lf(["#7295B5", "#5E6679"], [0, 1], -22.7, -7.3, -2.4, -0.7).s().p("AifDhQhNg2gHhoQgIhnBChdQBChdBmgbQBkgcBNA2QBNA2AHBnQAIBmhCBdQhDBdhlAcQgiAKggAAQg8AAgzgjg");
        this.shape_95.setTransform(29.2, 54.6);

        this.shape_96 = new cjs.Shape();
        this.shape_96.graphics.lf(["#7C9CB9", "#686D80"], [0, 1], -22.8, -7.4, -2.4, -0.8).s().p("AifDhQhNg2gIhoQgIhnBDhdQBCheBmgbQBkgcBNA2QBNA2AIBoQAIBmhDBdQhCBdhmAdQgiAKggAAQg9AAgygkg");
        this.shape_96.setTransform(29.2, 54.6);

        this.shape_97 = new cjs.Shape();
        this.shape_97.graphics.lf(["#86A2BE", "#727688"], [0, 1], -22.9, -7.4, -2.5, -0.8).s().p("AifDiQhOg2gHhpQgIhnBCheQBDhdBlgcQBlgcBOA2QBNA3AIBnQAHBmhCBeQhDBehlAcQgjAKghAAQg8AAgygjg");
        this.shape_97.setTransform(29.2, 54.6);

        this.shape_98 = new cjs.Shape();
        this.shape_98.graphics.lf(["#90A9C3", "#7C7F90"], [0, 1], -22.9, -7.4, -2.5, -0.7).s().p("AigDjQhNg3gIhpQgIhoBDhdQBDheBmgcQBlgcBNA3QBOA2AHBoQAIBmhDBeQhDBehlAdQgiAKghAAQg9AAgzgjg");
        this.shape_98.setTransform(29.2, 54.6);

        this.shape_99 = new cjs.Shape();
        this.shape_99.graphics.lf(["#9BB1C9", "#878899"], [0, 1], -23, -7.4, -2.5, -0.7).s().p("AigDjQhOg2gIhpQgHhpBDhdQBCheBmgcQBmgcBOA2QBOA3AHBnQAIBnhEBeQhDBehmAdQgiALghAAQg9AAgygkg");
        this.shape_99.setTransform(29.2, 54.6);

        this.shape_100 = new cjs.Shape();
        this.shape_100.graphics.lf(["#A6B9CE", "#9293A2"], [0, 1], -23, -7.5, -2.5, -0.8).s().p("AihDkQhOg3gIhpQgHhpBDheQBDheBmgcQBmgcBOA3QBOA2AIBoQAHBnhDBeQhEBfhmAdQgjAKghAAQg8AAgzgjg");
        this.shape_100.setTransform(29.2, 54.6);

        this.shape_101 = new cjs.Shape();
        this.shape_101.graphics.lf(["#B1C1D4", "#9F9FAC"], [0, 1], -23.1, -7.5, -2.5, -0.8).s().p("AihDlQhPg3gHhqQgIhpBDheQBDhfBngcQBmgcBPA3QBOA3AHBoQAHBmhDBfQhDBfhmAeQgjAKghAAQg+AAgygjg");
        this.shape_101.setTransform(29.2, 54.6);

        this.shape_102 = new cjs.Shape();
        this.shape_102.graphics.lf(["#BCCADA", "#ABABB7"], [0, 1], -23.2, -7.5, -2.5, -0.8).s().p("AiiDlQhOg3gIhqQgIhpBEhfQBDheBngcQBmgcBPA2QBOA3AIBoQAHBnhDBfQhEBfhnAeQgjALgiAAQg8AAgzgkg");
        this.shape_102.setTransform(29.2, 54.6);

        this.shape_103 = new cjs.Shape();
        this.shape_103.graphics.lf(["#C8D3E0", "#B9B9C2"], [0, 1], -23.2, -7.5, -2.4, -0.8).s().p("AiiDmQhPg3gHhrQgIhpBEhfQBDhfBogcQBmgcBPA3QBOA3AIBoQAHBnhDBfQhFBghmAeQgkALghAAQg9AAgzgkg");
        this.shape_103.setTransform(29.1, 54.6);

        this.shape_104 = new cjs.Shape();
        this.shape_104.graphics.lf(["#D5DCE6", "#C7C7CE"], [0, 1], -23.3, -7.5, -2.5, -0.8).s().p("AijDnQhPg3gHhrQgIhqBEhfQBDhfBogcQBngdBPA4QBPA3AHBoQAHBnhDBgQhFBghmAeQgkAKghAAQg+AAgzgjg");
        this.shape_104.setTransform(29.2, 54.6);

        this.shape_105 = new cjs.Shape();
        this.shape_105.graphics.lf(["#E1E6ED", "#D7D6DB"], [0, 1], -23.3, -7.5, -2.5, -0.8).s().p("AijDoQhPg4gIhrQgIhqBFhfQBEhgBngcQBogcBPA3QBPA3AHBpQAHBnhEBgQhEBghoAeQgkALgiAAQg9AAgygjg");
        this.shape_105.setTransform(29.1, 54.6);

        this.shape_106 = new cjs.Shape();
        this.shape_106.graphics.lf(["#EEF0F4", "#E8E7EA"], [0, 1], -23.4, -7.5, -2.5, -0.7).s().p("AijDoQhPg3gIhrQgIhrBEhfQBEhgBogdQBogcBPA3QBQA4AHBoQAHBohEBgQhFBghnAfQglALghAAQg+AAgygkg");
        this.shape_106.setTransform(29.1, 54.6);

        this.shape_107 = new cjs.Shape();
        this.shape_107.graphics.f("#FFFFFF").s().p("AijDpQhQg4gIhrQgIhrBEhgQBFhgBpgdQBngcBQA4QBPA3AHBpQAIBnhFBhQhFBhhnAeQgkALgiAAQg+AAgygjg");
        this.shape_107.setTransform(29.1, 54.6);

        this.shape_108 = new cjs.Shape();
        this.shape_108.graphics.lf(["#CBDFE3", "#DCE9EB", "#EEF4F4", "#F9FBFC", "#FFFFFF"], [0, 0.196, 0.451, 0.718, 1], -14.2, -28, 11.7, 22.8).s().p("AiwD5QhVg8gIhzQgJhzBKhmQBJhnBwgfQBvgeBVA8QBVA7AIBzQAJByhJBnQhJBnhwAeQglALgjAAQhEAAg5gng");
        this.shape_108.setTransform(29.2, 54.7);

        this.shape_109 = new cjs.Shape();
        this.shape_109.graphics.lf(["#CEE1E4", "#DCE9EB", "#EEF4F4", "#F9FBFC", "#FFFFFF"], [0, 0.169, 0.435, 0.71, 1], -14.4, -28.2, 11.6, 22.9).s().p("AixD5QhVg8gIhzQgJhzBKhnQBJhnBxgfQBvgfBWA8QBVA8AIB0QAJByhJBnQhKBohxAfQgkAKgjAAQhFAAg5gog");
        this.shape_109.setTransform(29.2, 54.7);

        this.shape_110 = new cjs.Shape();
        this.shape_110.graphics.lf(["#D1E3E6", "#DCE9EB", "#EEF4F4", "#F9FBFC", "#FFFFFF"], [0, 0.141, 0.416, 0.698, 1], -14.4, -28.3, 11.7, 23).s().p("AiyD7QhVg8gJh1QgJhyBLhpQBJhoBygeQBvgfBWA8QBWA8AJB1QAIByhJBoQhKBphyAeQglALgjAAQhFgBg5gng");
        this.shape_110.setTransform(29.2, 54.7);

        this.shape_111 = new cjs.Shape();
        this.shape_111.graphics.lf(["#D4E4E7", "#DCE9EB", "#EEF4F4", "#F9FBFC", "#FFFFFF"], [0, 0.11, 0.396, 0.686, 1], -14.5, -28.4, 11.8, 23.1).s().p("AizD8QhVg8gJh1QgJh0BLhoQBKhoBygfQBwgfBWA8QBXA9AIB1QAJBzhLBoQhJBphzAeQglALgjAAQhFAAg6gog");
        this.shape_111.setTransform(29.2, 54.7);

        this.shape_112 = new cjs.Shape();
        this.shape_112.graphics.lf(["#D7E6E9", "#DCE9EB", "#EEF4F4", "#F9FBFC", "#FFFFFF"], [0, 0.075, 0.373, 0.675, 1], -14.5, -28.5, 11.8, 23.2).s().p("AizD9QhXg9gJh1QgIh0BLhpQBKhpBygfQBxgfBXA9QBXA9AJB1QAIB0hLBpQhKBohyAfQgmALgkAAQhFAAg5gog");
        this.shape_112.setTransform(29.2, 54.7);

        this.shape_113 = new cjs.Shape();
        this.shape_113.graphics.lf(["#DAE8EA", "#DCE9EB", "#EEF4F4", "#F9FBFC", "#FFFFFF"], [0, 0.039, 0.345, 0.663, 1], -14.6, -28.7, 11.9, 23.3).s().p("Ai0D+QhXg9gJh1QgIh1BLhpQBKhqBzgfQByggBXA+QBXA8AJB3QAIB0hLBqQhLBphyAfQgmALgkAAQhFAAg6gpg");
        this.shape_113.setTransform(29.2, 54.7);

        this.shape_114 = new cjs.Shape();
        this.shape_114.graphics.lf(["#DDE9EC", "#EEF4F4", "#F9FBFC", "#FFFFFF"], [0, 0.318, 0.647, 1], -14.6, -28.9, 12, 23.4).s().p("Ai1EAQhXg+gJh2QgJh2BMhpQBLhqBzgfQByggBYA+QBXA9AJB2QAJB1hLBqQhMBqhzAfQgmALgkAAQhGAAg6gog");
        this.shape_114.setTransform(29.2, 54.7);

        this.shape_115 = new cjs.Shape();
        this.shape_115.graphics.lf(["#E0EBED", "#EEF4F4", "#F9FBFC", "#FFFFFF"], [0, 0.282, 0.627, 1], -14.7, -29, 12, 23.5).s().p("Ai1EAQhYg9gJh3QgJh2BMhqQBLhqB0ggQBzggBYA+QBYA+AIB3QAJB1hLBrQhMBqh0AgQgmALgkAAQhGAAg6gqg");
        this.shape_115.setTransform(29.2, 54.7);

        this.shape_116 = new cjs.Shape();
        this.shape_116.graphics.lf(["#E3EDEF", "#EEF4F4", "#F9FBFC", "#FFFFFF"], [0, 0.239, 0.608, 1], -14.7, -29.1, 12.1, 23.7).s().p("Ai2ECQhZg+gJh3QgIh3BMhqQBLhrB1ggQBzggBZA+QBYA+AJB4QAJB1hMBsQhMBqh1AgQgmALglAAQhGAAg6gpg");
        this.shape_116.setTransform(29.2, 54.7);

        this.shape_117 = new cjs.Shape();
        this.shape_117.graphics.lf(["#E6EFF0", "#EEF4F4", "#F9FBFC", "#FFFFFF"], [0, 0.188, 0.58, 1], -14.9, -29.3, 12.1, 23.7).s().p("Ai3EDQhZg+gJh4QgJh3BNhrQBMhsB1gfQBzggBZA+QBZA+AJB4QAJB2hMBsQhNBrh1AgQgmALgkAAQhHAAg7gpg");
        this.shape_117.setTransform(29.2, 54.7);

        this.shape_118 = new cjs.Shape();
        this.shape_118.graphics.lf(["#E9F1F2", "#EEF4F4", "#F9FBFC", "#FFFFFF"], [0, 0.129, 0.549, 1], -14.9, -29.4, 12.2, 23.9).s().p("Ai4EEQhZg+gJh4QgJh4BNhsQBMhsB2gfQB0ggBZA+QBZA+AJB5QAJB3hMBsQhNBrh1AgQgnALglAAQhHAAg7gpg");
        this.shape_118.setTransform(29.2, 54.7);

        this.shape_119 = new cjs.Shape();
        this.shape_119.graphics.lf(["#ECF3F3", "#EEF4F4", "#F9FBFC", "#FFFFFF"], [0, 0.051, 0.51, 1], -15, -29.5, 12.2, 24).s().p("Ai5EFQhag+gJh5QgIh4BNhtQBNhsB2ggQB0ggBaA+QBaBAAJB5QAIB3hNBtQhNBsh2AgQgmALglAAQhIAAg7gqg");
        this.shape_119.setTransform(29.2, 54.7);

        this.shape_120 = new cjs.Shape();
        this.shape_120.graphics.lf(["#EFF5F5", "#F9FBFC", "#FFFFFF"], [0, 0.455, 1], -15, -29.6, 12.3, 24.1).s().p("Ai6EGQhag+gJh6QgJh5BOhtQBNhsB2ggQB2ghBaBAQBaA/AJB5QAJB5hNBsQhOBth2AhQgnAKglAAQhIAAg8gqg");
        this.shape_120.setTransform(29.2, 54.7);

        this.shape_121 = new cjs.Shape();
        this.shape_121.graphics.lf(["#F3F7F7", "#F9FBFC", "#FFFFFF"], [0, 0.376, 1], -15.2, -29.8, 12.3, 24.2).s().p("Ai7EIQhahAgJh5QgJh6BOhtQBNhtB3ghQB2ggBbA/QBaA/AJB6QAJB6hOBtQhOBth3AhQgnALglAAQhIAAg8gqg");
        this.shape_121.setTransform(29.2, 54.7);

        this.shape_122 = new cjs.Shape();
        this.shape_122.graphics.lf(["#F6F9F9", "#F9FBFC", "#FFFFFF"], [0, 0.243, 1], -15.2, -29.9, 12.4, 24.3).s().p("Ai8EJQhahAgJh6QgKh6BPhuQBNhuB4ggQB2ggBcA/QBbBAAIB6QAKB6hPBtQhOBuh4AhQgnALglAAQhJAAg8gqg");
        this.shape_122.setTransform(29.2, 54.7);

        this.shape_123 = new cjs.Shape();
        this.shape_123.graphics.lf(["#FAFCFC", "#FFFFFF"], [0, 1], -15.2, -30, 12.5, 24.4).s().p("Ai8EKQhbhAgJh7QgKh7BPhuQBOhtB4giQB3ggBbBAQBcBAAJB7QAJB6hPBuQhOBvh4AgQgnALgmAAQhJAAg8gqg");
        this.shape_123.setTransform(29.2, 54.7);

        this.shape_124 = new cjs.Shape();
        this.shape_124.graphics.f("#FFFFFF").s().p("Ai9EMQhchBgJh8QgJh6BPhvQBPhvB4ghQB4ggBbA/QBcBBAJB7QAJB8hPBuQhPBvh4AgQgoAMglAAQhKAAg8gqg");
        this.shape_124.setTransform(29.2, 54.7);

        this.shape_125 = new cjs.Shape();
        this.shape_125.graphics.lf(["#467FA3", "#94C5D6", "#9FCED9", "#DFEAEC"], [0, 0.361, 0.69, 1], -0.9, 3.8, 0.7, -5.4).s().p("Ag7AwQgNgJAMgwQAMgxAPgBIBkAKQgSADgLAzQgMA0ARADQhjgJgDgDg");
        this.shape_125.setTransform(43.4, 23);

        this.shape_126 = new cjs.Shape();
        this.shape_126.graphics.lf(["#B4DCE2", "#FFFFFF"], [0, 1], 57.7, 31.2, -8.9, -4.2).s().p("AAWB1IgCgDQgBgCACgGQACgGADAAIAFgBIAegLQATgIAPgUQAZgegBgrQgBg2gwgUQhagmhHBZQgUAYACAoQACAkAQAYQgCAGgCACIgCALQgigdAAgqQAAgoAigrQAmgvA0gQQA0gQAqAaQArAaACA1QACAygmAvQgNAQgNAHIgfANQgNAFgDAAIgBAAg");
        this.shape_126.setTransform(47, 11.8);

        this.shape_127 = new cjs.Shape();
        this.shape_127.graphics.lf(["#ACD4DD", "#F4FAFB"], [0, 1], 54, 30.9, -8.9, -4.5).s().p("AAWB1IgCgDQgBgCACgGQACgGADgBIAEgBIAegLQATgIAPgTQAZgfgBgqQgBg1gvgUQgxgVgrARQglAOgfAnQgUAZACAnQACAjAQAZIgFAIIgDAMQgigeAAgpQAAgpAigrQAmgvA1gQQA0gQArAaQAqAbACA0QACAzglAuQgNAQgNAIIggANQgNAGgDAAIgBgBg");
        this.shape_127.setTransform(47, 11.9);

        this.shape_128 = new cjs.Shape();
        this.shape_128.graphics.lf(["#A4CDD8", "#EBF6F8"], [0, 1], 50.5, 30.6, -8.9, -4.7).s().p("AAWB2IgCgEQgBgCACgHQACgFADgBIAEgBIAegLQASgJAPgTQAZgfgBgqQgBgzgvgVQgvgUgrARQglAOgfAmQgUAYACAmQABAjAQAZIgFAKIgDAMQgigdAAgrQAAgpAigrQAmgvA1gPQA1gQAqAaQArAbACA0QACAygmAvQgNAQgNAIIggAOQgNAFgDAAIgBAAg");
        this.shape_128.setTransform(47, 11.9);

        this.shape_129 = new cjs.Shape();
        this.shape_129.graphics.lf(["#9DC6D4", "#E3F2F6"], [0, 1], 47.2, 30.1, -8.8, -5).s().p("AAWB2IgDgEIACgJQACgFACgCIAFgBIAdgMQASgIAPgTQAZgfgBgpQgBgzgugUQgugVgrARQgmANgeAmQgUAZABAlQACAjAPAYIgFALQgBADgCAKQgigeAAgqQAAgqAigrQAmgvA1gPQA1gQAqAbQArAaACA0QACAzglAuQgNAQgOAJQgHAEgZAKIgJAEIgHACIgBgBg");
        this.shape_129.setTransform(47, 12);

        this.shape_130 = new cjs.Shape();
        this.shape_130.graphics.lf(["#95BFCF", "#DAEFF4"], [0, 1], 43.8, 29.6, -8.7, -5.2).s().p("AAVB3QgCgCAAgCQgBgDACgHQACgFADgCIAEgBIAegMQASgJAOgSQAZgfgBgpQgCgygsgUQgugVgqAQQgmAOgeAlQgUAZABAlQABAiAPAYIgFALIgDAOQgigdgBgrQAAgqAigrQAmgvA1gPQA2gQAqAbQArAaACA0QADAzgmAuQgNARgOAIQgJAGgYAJQgNAFgDAAIgBAAg");
        this.shape_130.setTransform(47.1, 12);

        this.shape_131 = new cjs.Shape();
        this.shape_131.graphics.lf(["#8EB8CB", "#D2EBF1"], [0, 1], 40.4, 28.7, -8.7, -5.5).s().p("AAVB3QgEgEADgKQACgGADgCIAEgBIAdgMQASgJAOgSQAZgfgBgpQgCgxgrgUQgtgVgqAQQgmANgeAmQgUAYAAAkQABAiAPAYQgGAOgDAMQgigdAAgrQAAgrAigqQAmgvA1gPQA2gQAqAbQArAaADA0QACAzglAuQgOARgOAJQgKAGgXAJQgNAGgDAAIgBgBg");
        this.shape_131.setTransform(47.1, 12.1);

        this.shape_132 = new cjs.Shape();
        this.shape_132.graphics.lf(["#87B2C7", "#CAE7EF"], [0, 1], 37, 27.8, -8.6, -5.7).s().p("AAUB4QgEgEAEgLQACgGACgBIAEgDIAegMQARgJANgRQAagggCgoQgCgwgqgUQgrgUgqAPQgnANgeAlQgUAYABAkQAAAhAPAYQgGANgDAPQgigeAAgrQgBgrAigrQAmguA2gPQA2gQAqAbQArAaADA0QACAzglAuQgNARgPAJQgLAHgXAJQgNAFgDAAIgBAAg");
        this.shape_132.setTransform(47.1, 12.1);

        this.shape_133 = new cjs.Shape();
        this.shape_133.graphics.lf(["#81ACC3", "#C1E4ED"], [0, 1], 33.7, 26.5, -8.5, -6).s().p("AAUB5QgEgFAEgMQACgGACgCIAEgCIAdgMQARgJANgRQAagggCgoQgCgvgpgUQgqgUgqAOQgnANgeAlQgUAYAAAjQAAAhAPAYQgHAPgCAOQgigdgBgsQAAgrAigrQAlguA3gPQA2gQAqAbQArAaADA0QADAzglAuQgOARgPAKQgMAHgWAJQgOAGgDAAIAAAAg");
        this.shape_133.setTransform(47.1, 12.2);

        this.shape_134 = new cjs.Shape();
        this.shape_134.graphics.lf(["#7AA6BF", "#B9E0EB"], [0, 1], 30.5, 25.2, -8.4, -6.2).s().p("AAUB5QgEgFAEgMQABgGADgCIAEgCIAdgNQAQgJANgRQAagggCgoQgCgugogTQgpgVgqAOQgoANgcAkQgUAZgBAiQAAAhAPAXQgIARgCAOQgigdgBgtQAAgrAigrQAlguA3gPQA2gPArAaQArAbADA0QADAygmAvQgNARgQAKQgMAIgXAJIgIAEIgHACIgBgBg");
        this.shape_134.setTransform(47.1, 12.2);

        this.shape_135 = new cjs.Shape();
        this.shape_135.graphics.lf(["#73A0BB", "#B1DDE9"], [0, 1], 27.3, 23.7, -8.2, -6.5).s().p("AATB6QgEgGAEgMQADgIAFgDIAdgNQAQgJANgQQAagggCgoQgDgtgngUQgogUgpANQgoANgdAkQgUAZgBAhQgBAgAPAYQgHAQgDAQQgigdAAgtQgBgtAigqQAmguA2gPQA3gPAqAbQArAbAEAzQADAzgmAuQgNARgQALQgNAJgWAIIgJAEIgGACIgCAAg");
        this.shape_135.setTransform(47.2, 12.3);

        this.shape_136 = new cjs.Shape();
        this.shape_136.graphics.lf(["#6D9BB7", "#A8DAE7"], [0, 1], 24.2, 22, -8.1, -6.8).s().p("AATB6QgEgEAEgPQADgIAFgDIAdgNQAPgJANgQQAagggCgnQgDgsgmgUQgmgUgqANQgoAMgdAjQgUAZgBAhQgBAgAPAXQgIAQgDASQgigegBgtQAAgsAigqQAlgvA3gOQA3gPArAaQArAbADA0QAEAygmAvQgOARgQALQgOAJgVAJQgNAGgDAAIgBgBg");
        this.shape_136.setTransform(47.2, 12.3);

        this.shape_137 = new cjs.Shape();
        this.shape_137.graphics.lf(["#6695B4", "#A0D6E5"], [0, 1], 21.2, 20.2, -7.9, -7).s().p("AATB7QgFgGAFgOQADgJAFgCIAcgOQAQgJAMgPQAaghgCgnQgDgrglgUQglgUgqANQgoAMgdAjQgUAZgCAgQgBAfAPAYQgHAOgEAVQgigegBgtQAAgtAigqQAlgvA3gOQA3gPArAbQArAbAEA0QADAyglAuQgYAegrASQgNAFgDAAIAAAAg");
        this.shape_137.setTransform(47.2, 12.4);

        this.shape_138 = new cjs.Shape();
        this.shape_138.graphics.lf(["#6090B0", "#97D3E3"], [0, 1], 18.2, 18.3, -7.8, -7.2).s().p("AASB7QgEgFAFgPQADgKAFgCIAcgOQAPgJAMgPQAaghgCgmQgDgqgkgUQgkgUgqAMQgoAMgcAiQgVAagCAfQgCAfAPAXQgIASgDATQgjgeAAguQgBgtAigqQAmgvA3gOQA3gOArAbQArAaAEA0QAEAygmAvQgYAfgrARQgNAGgDAAIgBgBg");
        this.shape_138.setTransform(47.2, 12.4);

        this.shape_139 = new cjs.Shape();
        this.shape_139.graphics.lf(["#598BAD", "#8FD0E2"], [0, 1], 15.3, 16.2, -7.6, -7.4).s().p("AASB8QgFgFAFgRQADgJAFgDIAcgOQAPgJALgOQAbgigDgmQgCgpgjgUQgjgUgqAMQgpALgcAjQgUAZgCAfQgCAeAOAXQgIARgEAWQgigegBguQAAguAigqQAlguA4gOQA3gPArAbQArAbAEA0QAEAyglAuQgaAhgrARQgNAFgDAAIAAAAg");
        this.shape_139.setTransform(47.2, 12.5);

        this.shape_140 = new cjs.Shape();
        this.shape_140.graphics.lf(["#5287A9", "#86CDE0"], [0, 1], 12.6, 14, -7.4, -7.7).s().p("AARB9QgEgGAFgRQAEgKAEgCQATgJAJgGQAOgJALgOQAbghgDgmQgDgogigUQgigTgpAKQgpALgcAjQgUAZgDAeQgCAeAOAXQgIAQgEAYQgigegBguQgBgvAigqQAmguA4gOQA3gOArAbQArAaAEA1QAEAyglAuQgaAigrAQQgMAGgEAAIgBAAg");
        this.shape_140.setTransform(47.2, 12.5);

        this.shape_141 = new cjs.Shape();
        this.shape_141.graphics.lf(["#4B82A6", "#7ECADE"], [0, 1], 10, 11.7, -7.2, -7.9).s().p("AARB9QgEgFAFgSQAEgLAEgCQATgJAIgGQAOgJALgOQAbgigDglQgDgnghgTQghgUgpALQgpAKgcAiQgUAagDAdQgDAdAPAXQgIASgFAXQgigdgBgvQgBgvAigqQAlguA5gOQA4gNArAaQArAbAEA0QAEAyglAuQgcAjgqARQgOAFgCAAIgBAAg");
        this.shape_141.setTransform(47.2, 12.6);

        this.shape_142 = new cjs.Shape();
        this.shape_142.graphics.lf(["#447EA3", "#75C8DC"], [0, 1], 7.5, 9.2, -7.2, -8.2).s().p("AARB9QgFgFAGgSQAEgMADgCQASgIAJgHQAOgJALgNQAbgigDglQgDgmgggUQgggUgpALQgqAKgbAiQgVAZgDAdQgDAdAOAWQgJAUgEAXQgigdgBgvQAAgvAhgqQAlguA5gOQA4gOArAbQAsAaAEA0QAEAzglAuQgdAkgqAQQgNAGgDAAIAAgBg");
        this.shape_142.setTransform(47.3, 12.6);

        this.shape_143 = new cjs.Shape();
        this.shape_143.graphics.lf(["#447EA3", "#75C8DC"], [0, 1], 5.8, 10.6, -5.6, -9.6).s().p("AARB+QgFgGAGgSQAEgMADgCQASgIAJgGQAOgJALgOQAbgigDglQgDgmgggTQgggUgpAKQgqAKgbAiQgVAagDAcQgDAdAOAXQgJAUgEAXQgigegBgvQgBgvAigqQAlguA5gOQA4gOArAbQAsAbAEA0QAEAyglAuQgcAjgrASQgNAFgDAAIAAAAg");
        this.shape_143.setTransform(47.3, 12.6);

        this.shape_144 = new cjs.Shape();
        this.shape_144.graphics.lf(["#447EA3", "#75C8DC"], [0, 1], 3.9, 11.9, -3.7, -10.7).s().p("AARB+QgFgGAGgSQAEgMADgCQATgJAIgFQAOgKALgNQAbgigDglQgDgmgggUQgggTgpAKQgqAKgbAiQgVAagDAcQgDAdAOAXQgJATgEAXQgigdgBgvQgBgvAigqQAlguA5gOQA4gOArAbQAsAbAEAzQAEAzglAuQgcAjgrASQgNAFgDAAIAAAAg");
        this.shape_144.setTransform(47.4, 12.7);

        this.shape_145 = new cjs.Shape();
        this.shape_145.graphics.lf(["#447EA3", "#75C8DC"], [0, 1], 1.8, 12.6, -1.7, -11.6).s().p("AARB+QgEgHAFgRIADgJQACgDADgCQARgIAKgHQANgJALgNQAcgigEglQgDgmgggUQgggUgoALQgqAKgcAiQgUAZgEAdQgDAdAPAWQgJAUgEAXQgjgdAAgvQgBgvAigqQAlguA5gOQA4gOArAbQArAbAEAzQAFAzglAuQgdAkgqAQQgOAGgDAAIAAAAg");
        this.shape_145.setTransform(47.4, 12.7);

        this.shape_146 = new cjs.Shape();
        this.shape_146.graphics.lf(["#447EA3", "#75C8DC"], [0, 1], -0.5, 12.5, 0.6, -12.4).s().p("AARB9QgEgFAFgTIADgIQACgEADgBQARgIAKgHQANgJALgNQAbgigDglQgDgmgggUQgggUgoALQgqAKgcAiQgUAZgEAdQgDAdAPAWQgKAVgDAWQgjgdAAgvQgBgvAigqQAlgvA5gNQA4gOArAbQArAaAEA0QAFAzglAuQgdAkgqAQQgNAGgEAAIAAgBg");
        this.shape_146.setTransform(47.4, 12.8);

        this.shape_147 = new cjs.Shape();
        this.shape_147.graphics.lf(["#447EA3", "#75C8DC"], [0, 1], -2.8, 12.5, 3, -12.5).s().p("AARB+QgEgFAFgTIADgJQACgDADgCQASgJAJgFQANgKALgNQAbgigDglQgDgmgggUQgggTgoAKQgqAKgcAiQgUAagEAcQgDAdAPAXQgJATgEAXQgjgdAAgvQgBgvAigqQAlguA5gOQA4gOArAbQArAbAEA0QAFAyglAuQgcAjgrASQgNAFgEAAIAAAAg");
        this.shape_147.setTransform(47.5, 12.8);

        this.shape_148 = new cjs.Shape();
        this.shape_148.graphics.lf(["#447EA3", "#75C8DC"], [0, 1], -5.5, 12.8, 5.6, -12.3).s().p("AARB+QgFgHAGgRQADgMAFgCQARgIAKgHQANgJALgNQAbgigDglQgDgmgggUQgggUgoALQgqAKgcAiQgUAagEAcQgDAdAPAXQgJATgEAXQgjgdAAgvQgBgvAigqQAlguA5gOQA4gOArAbQArAbAEAzQAFAzglAuQgdAkgqAQQgOAGgDAAIAAAAg");
        this.shape_148.setTransform(47.5, 12.8);

        this.shape_149 = new cjs.Shape();
        this.shape_149.graphics.lf(["#447EA3", "#75C8DC"], [0, 1], -8.1, 12.3, 8.2, -11.5).s().p("AARB9QgFgFAGgSQADgMAEgCQASgIAKgHQANgJALgNQAbgigDglQgDgmgggUQgggUgoALQgqAKgcAiQgUAZgEAdQgDAdAPAWQgKAVgDAWQgjgdAAgvQgBgvAigqQAlguA5gOQA4gOArAbQArAaAEA0QAEAzglAuQgcAkgqAQQgNAGgEAAIAAgBg");
        this.shape_149.setTransform(47.6, 12.9);

        this.shape_150 = new cjs.Shape();
        this.shape_150.graphics.lf(["#447EA3", "#75C8DC"], [0, 1], -10.4, 10.8, 10.2, -9.8).s().p("AARB+QgCgDAAgHQABgHACgHQAEgMADgCQASgIAKgGQANgJALgOQAbgigDglQgDgmgggUQgggTgoAKQgqAKgcAiQgUAagEAcQgDAdAPAXQgKAUgDAWQgjgdAAgvQgBgvAigqQAlguA5gOQA4gOArAbQArAbAEA0QAEAyglAuQgbAjgrASQgNAFgEAAIAAAAg");
        this.shape_150.setTransform(47.6, 12.9);

        this.shape_151 = new cjs.Shape();
        this.shape_151.graphics.lf(["#447EA3", "#75C8DC"], [0, 1], -12.1, 8.7, 12.3, -8).s().p("AARB+QgFgHAGgRQADgMAEgCQATgJAJgGQANgJALgNQAbgigDglQgDgmgggUQgggTgoAKQgqAKgcAiQgUAagEAcQgDAdAPAXQgJATgEAXQgjgdAAgvQgBgvAigqQAlguA5gOQA4gOArAbQArAbAEAzQAEAzglAuQgcAkgqAQQgOAGgDAAIAAAAg");
        this.shape_151.setTransform(47.7, 12.9);

        this.shape_152 = new cjs.Shape();
        this.shape_152.graphics.lf(["#447EA3", "#75C8DC"], [0, 1], -13.6, 6.3, 13.6, -5.6).s().p("AARB9QgFgFAGgSQADgMAEgCQASgIAKgHQANgJALgNQAbgigDglQgDgmgggUQgggUgoALQgqAKgcAiQgUAZgEAdQgDAdAPAWQgJATgFAYQgigdAAgvQgBgvAigqQAlguA5gOQA4gOArAbQArAaAEA0QAEAzglAuQgcAkgqAQQgNAGgEAAIAAgBg");
        this.shape_152.setTransform(47.7, 13);

        this.shape_153 = new cjs.Shape();
        this.shape_153.graphics.lf(["#447EA3", "#75C8DC"], [0, 1], -14.1, 3.6, 14.3, -3).s().p("AARB+QgCgDAAgHQABgHACgHQAEgMADgCQASgIAKgGQANgJALgOQAbgigDglQgDgmgggTQgggUgoAKQgqAKgcAiQgUAagEAcQgDAdAPAXQgJATgFAYQgigeAAgvQgBgvAigqQAlguA5gOQA4gOArAbQArAbAEA0QAEAyglAuQgbAjgrASQgNAFgEAAIAAAAg");
        this.shape_153.setTransform(47.8, 13);

        this.shape_154 = new cjs.Shape();
        this.shape_154.graphics.lf(["#447EA3", "#75C8DC"], [0, 1], -14.3, 0.7, 14.5, -0.5).s().p("AARB+QgCgDAAgHQABgHACgHQADgMAEgCIAcgOQANgKALgNQAbgigDglQgDgmgggUQgggTgoAKQgqAKgcAiQgUAagEAcQgDAdAPAXQgJASgFAYQgigdAAgvQgBgvAigqQAlguA5gOQA4gOArAbQArAbAEAzQAEAzglAuQgbAjgrASIgJADIgHACIgBAAg");
        this.shape_154.setTransform(47.8, 13);

        this.shape_155 = new cjs.Shape();
        this.shape_155.graphics.lf(["#447EA3", "#75C8DC"], [0, 1], -13.5, -2.2, 13.9, 1.7).s().p("AARB+QgFgHAGgRQADgMAEgCQASgIAKgHQANgJALgNQAbgigDglQgDgmgggUQgggUgoALQgqAKgcAiQgUAZgEAdQgDAdAPAWQgIARgGAaQgigdAAgvQgBgvAigqQAlguA5gOQA4gOArAbQArAbAEAzQAEAzglAuQgcAkgrAQQgNAGgDAAIAAAAg");
        this.shape_155.setTransform(47.9, 13.1);

        this.shape_156 = new cjs.Shape();
        this.shape_156.graphics.lf(["#447EA3", "#75C8DC"], [0, 1], -12.6, -4.3, 13.2, 4.4).s().p("AARB9QgFgFAGgTQAEgLADgCQASgIAKgHQANgJALgNQAbgigDglQgDgmgggUQgggUgpALQgpAKgcAiQgUAZgEAdQgDAdAPAWQgJARgFAaQgigdAAgvQgBgvAigqQAlgvA5gNQA4gOArAbQArAaAEA0QAEAzglAuQgcAkgrAQQgNAGgDAAIAAgBg");
        this.shape_156.setTransform(47.9, 13.1);

        this.shape_157 = new cjs.Shape();
        this.shape_157.graphics.lf(["#447EA3", "#75C8DC"], [0, 1], -11.1, -6, 11.6, 6.7).s().p("AARB+QgFgGAGgSQAEgMADgCIAcgOQANgKALgNQAbgigDglQgDgmgggUQgggTgpAKQgpAKgcAiQgUAagEAcQgDAdAPAXQgIAPgGAbQgigdAAgvQgBgvAigqQAlguA5gOQA4gOArAbQArAbAEA0QAEAyglAuQgbAjgsASQgNAFgDAAIAAAAg");
        this.shape_157.setTransform(48, 13.1);

        this.shape_158 = new cjs.Shape();
        this.shape_158.graphics.lf(["#447EA3", "#75C8DC"], [0, 1], -9.7, -7.8, 10.1, 8.8).s().p("AARB+QgFgGAGgSQAEgMADgCQASgIAKgHQANgJALgNQAbgigDglQgDgmgggUQgggUgpALQgpAKgcAiQgUAagEAcQgDAdAPAXQgIAPgGAbQgigdAAgvQgBgvAigqQAlguA5gOQA3gOAsAbQArAbAEAzQAEAzglAuQgcAkgrAQIgIAEIgHACIgBAAg");
        this.shape_158.setTransform(48, 13.2);

        this.shape_159 = new cjs.Shape();
        this.shape_159.graphics.lf(["#B4DCE2", "#FFFFFF"], [0, 1], 14.9, -2.7, -10.8, 2.7).s().p("AAWB1IgCgDQgBgCACgGQACgGADAAIAFgBIAegLQATgIAPgUQAZgegBgrQgBg2gwgUQhagmhHBZQgUAYACAoQACAkAQAYQgCAGgCACIgCALQgigdAAgqQAAgoAigrQAmgvA0gQQA0gQAqAaQArAaACA1QACAygmAvQgNAQgNAHIgfANQgNAFgDAAIgBAAg");
        this.shape_159.setTransform(47, 11.8);

        this.shape_160 = new cjs.Shape();
        this.shape_160.graphics.lf(["#467FA3", "#3B4C61"], [0, 1], -1.9, -0.6, 1.4, 0.5).s().p("AgQA0QgFgHABgUQABgUAHgUQAHgWAHgKQAJgLAFAHQAGAHgBAUQgBAUgHAUQgHAWgIAKQgFAHgEAAQgDAAgCgDg");
        this.shape_160.setTransform(48.9, 23.5);

        this.shape_161 = new cjs.Shape();
        this.shape_161.graphics.f("#1E6B90").s().p("AANArQgNgFgOgQQgOgQgFgRQgFgSAGgJQAGgKAOAFQANAFAOARQANAQAGARQAFASgGAJQgEAGgHAAQgEAAgFgCg");
        this.shape_161.setTransform(59, 37.7);

        this.shape_162 = new cjs.Shape();
        this.shape_162.graphics.f("#257094").s().p("AANAtQgNgFgOgRQgOgRgGgSQgFgSAHgKQAGgJAOAFQAOAGANAQQAOARAFARQAGATgHAJQgEAHgHAAQgEAAgFgCg");
        this.shape_162.setTransform(59, 37.8);

        this.shape_163 = new cjs.Shape();
        this.shape_163.graphics.f("#2D7498").s().p("AANAuQgOgGgNgRQgOgRgGgSQgFgTAGgKQAGgJAPAFQANAFAOASQAOARAGASQAFATgGAJQgEAHgIAAQgEAAgFgCg");
        this.shape_163.setTransform(59, 37.9);

        this.shape_164 = new cjs.Shape();
        this.shape_164.graphics.f("#35799C").s().p("AANAvQgOgFgNgSQgOgSgGgSQgFgUAGgKQAGgKAPAGQAOAFANASQAPASAFASQAFAUgGAKQgEAGgIAAQgEAAgFgCg");
        this.shape_164.setTransform(59, 38);

        this.shape_165 = new cjs.Shape();
        this.shape_165.graphics.f("#3C7EA0").s().p("AANAwQgOgFgOgSQgPgTgEgTQgGgUAHgKQAGgKAOAGQAOAFAOASQAPASAFAUQAGAUgHAKQgEAGgHAAQgFAAgFgCg");
        this.shape_165.setTransform(59, 38.1);

        this.shape_166 = new cjs.Shape();
        this.shape_166.graphics.f("#4383A5").s().p("AANAyQgOgGgOgTQgPgSgFgUQgFgUAGgLQAHgKAOAFQAPAGAOATQAPASAFAUQAFAUgGALQgFAHgHAAQgFAAgFgCg");
        this.shape_166.setTransform(59, 38.2);

        this.shape_167 = new cjs.Shape();
        this.shape_167.graphics.f("#4A89AA").s().p("AAOAzQgOgGgPgTQgPgTgFgUQgGgVAHgLQAGgLAQAGQAOAGAOATQAPATAFAUQAGAVgHALQgEAHgHAAQgFAAgFgCg");
        this.shape_167.setTransform(58.9, 38.3);

        this.shape_168 = new cjs.Shape();
        this.shape_168.graphics.f("#518FAF").s().p("AAOA0QgPgGgOgTQgPgUgGgVQgFgVAGgLQAHgLAPAGQAPAGAOAUQAPATAGAVQAFAVgGALQgEAHgIAAQgFAAgFgCg");
        this.shape_168.setTransform(58.9, 38.4);

        this.shape_169 = new cjs.Shape();
        this.shape_169.graphics.f("#5895B4").s().p("AAOA1QgPgGgOgUQgPgTgGgWQgGgWAHgLQAHgLAPAGQAPAGAOAUQAPAUAGAVQAGAWgHAMQgEAHgIAAQgFAAgFgDg");
        this.shape_169.setTransform(58.9, 38.5);

        this.shape_170 = new cjs.Shape();
        this.shape_170.graphics.f("#5F9CB9").s().p("AAOA2QgPgGgPgVQgPgUgGgVQgFgXAHgLQAGgMAQAGQAPAHAPAUQAPAUAFAWQAGAXgHAMQgEAHgIAAQgEAAgGgDg");
        this.shape_170.setTransform(58.9, 38.7);

        this.shape_171 = new cjs.Shape();
        this.shape_171.graphics.f("#65A2BE").s().p("AAOA4QgPgHgPgUQgPgVgGgWQgGgXAHgMQAHgMAQAGQAOAHAQAVQAPAVAGAWQAGAXgHAMQgFAHgHAAQgFAAgGgCg");
        this.shape_171.setTransform(58.9, 38.7);

        this.shape_172 = new cjs.Shape();
        this.shape_172.graphics.f("#6DA9C4").s().p("AAOA5QgPgHgPgVQgQgWgFgWQgGgYAHgMQAHgMAQAHQAPAHAPAVQAPAVAGAXQAGAXgHAMQgEAIgIAAQgFAAgGgCg");
        this.shape_172.setTransform(58.9, 38.9);

        this.shape_173 = new cjs.Shape();
        this.shape_173.graphics.f("#74B0C9").s().p("AAPA6QgQgHgPgWQgQgVgFgYQgHgYAIgMQAGgMAQAHQAQAHAPAVQAPAWAGAXQAHAYgIANQgEAIgIAAQgFAAgFgDg");
        this.shape_173.setTransform(58.9, 39);

        this.shape_174 = new cjs.Shape();
        this.shape_174.graphics.f("#7BB8CF").s().p("AAPA7QgQgGgQgXQgPgWgGgYQgGgYAHgNQAIgMAPAGQAQAHAQAXQAPAWAGAYQAGAYgHANQgFAIgIAAQgFAAgFgDg");
        this.shape_174.setTransform(58.9, 39.1);

        this.shape_175 = new cjs.Shape();
        this.shape_175.graphics.f("#82C0D6").s().p("AAPA9QgQgHgQgXQgPgXgGgYQgHgZAIgNQAHgNAQAHQAQAHAQAXQAPAXAGAYQAHAZgIANQgEAIgJAAQgFAAgFgCg");
        this.shape_175.setTransform(58.9, 39.2);

        this.shape_176 = new cjs.Shape();
        this.shape_176.graphics.f("#8AC9DD").s().p("AAPA+QgPgHgQgXQgQgXgHgZQgGgaAIgNQAHgNAQAHQAQAHAQAYQAQAXAGAZQAGAZgHANQgFAIgJAAQgFAAgFgCg");
        this.shape_176.setTransform(58.9, 39.3);

        this.shape_177 = new cjs.Shape();
        this.shape_177.graphics.f("#92D4E5").s().p("AAPA/QgQgHgQgYQgQgXgGgaQgGgaAHgNQAHgNARAHQAQAHAQAYQAQAYAGAZQAHAagIANQgFAJgIAAQgFAAgGgDg");
        this.shape_177.setTransform(58.9, 39.4);

        this.shape_178 = new cjs.Shape();
        this.shape_178.graphics.f("#92D4E5").s().p("Ag4CTQg6hHgHhWQgIhiBChFIA/AnQBPAzAeBVQAcBRgbBbQAAgvgEgzQgJhlgugDQgCAAgEAtQgFA7gHAhQgQBJgcAAQgUAAgZgfg");
        this.shape_178.setTransform(52.3, 44.4);

        this.shape_179 = new cjs.Shape();
        this.shape_179.graphics.f("#8AC9DD").s().p("Ag6CVQg5hGgGhYQgHhkBChGIA+AoQBQAzAdBXQAcBUgdBaQAAgsgFgvQgKhdgtgDQgCAAgFAqQgGA3gHAeQgPBDgbAAQgTAAgZgfg");
        this.shape_179.setTransform(52.3, 44.6);

        this.shape_180 = new cjs.Shape();
        this.shape_180.graphics.f("#82C0D6").s().p("Ag7CXQg5hFgFhbQgGhmBChFIA/AnQBQAzAcBaQAcBXgfBZQgBgogFgsQgLhWgsgDQgDAAgFAnQgGA0gHAbQgPA8gaAAQgTAAgYgeg");
        this.shape_180.setTransform(52.2, 44.8);

        this.shape_181 = new cjs.Shape();
        this.shape_181.graphics.f("#7BB8CF").s().p("Ag9CaQg4hFgEheQgFhoBChFIA/AnQBQAzAcBcQAbBagiBZQgBglgGgnQgMhQgqgDQgGAAgQBtQgPA2gYAAQgTAAgYgdg");
        this.shape_181.setTransform(52.2, 45);

        this.shape_182 = new cjs.Shape();
        this.shape_182.graphics.f("#74B0C9").s().p("Ag+CcQg4hFgEhfQgDhqBChGIA/AoQBQAzAbBeQAbBdgjBXQgCgggGgkQgNhIgqgDQgDgBgGAiQgIAsgGAWQgPAwgXAAQgSAAgXgdg");
        this.shape_182.setTransform(52.1, 45.2);

        this.shape_183 = new cjs.Shape();
        this.shape_183.graphics.f("#6DA9C4").s().p("AhACeQg3hEgDhiQgChrBDhGIA+AnQBQAzAbBhQAbBggmBWQgCgdgHggQgOhAgogEQgEAAgGAeQgJAqgGARQgOAqgWAAQgSAAgXgcg");
        this.shape_183.setTransform(52.1, 45.4);

        this.shape_184 = new cjs.Shape();
        this.shape_184.graphics.f("#65A2BE").s().p("AhBChQg4hEgBhlQgChtBDhGIA/AnQBQAzAbBkQAaBjgoBVQgDgZgHgdQgPg5gngDQgEgBgHAbQgKAmgGAPQgNAkgUAAQgSAAgWgbg");
        this.shape_184.setTransform(52.1, 45.6);

        this.shape_185 = new cjs.Shape();
        this.shape_185.graphics.f("#5F9CB9").s().p("AhDCjQg3hDAAhnQgBhvBDhHIA/AoQBQAzAaBmQAaBlgpBVQgEgWgIgYQgQgygmgDQgEgBgHAYQgLAigGAMQgNAegSAAQgSAAgWgbg");
        this.shape_185.setTransform(52, 45.8);

        this.shape_186 = new cjs.Shape();
        this.shape_186.graphics.f("#5895B4").s().p("ABTCZQgRgqgkgEQgFAAgIAUQgLAfgFAKQgbAwgqg0Qg3hDAAhpQABhwBEhHIA/AnQBQA0AZBpQAaBngsBUQgEgSgJgVg");
        this.shape_186.setTransform(52, 46.1);

        this.shape_187 = new cjs.Shape();
        this.shape_187.graphics.f("#518FAF").s().p("ABRCjQgSgjgkgDQgFgBgIASQgNAZgEAIQgbAogogxQg2hCABhrQAChzBEhIIA/AoQBQAzAZBsQAZBrgtBTQgFgPgJgRg");
        this.shape_187.setTransform(51.9, 46.4);

        this.shape_188 = new cjs.Shape();
        this.shape_188.graphics.f("#4A89AA").s().p("ABOCtQgTgbgigFQgGgBgIAPIgRAbQgcAgglguQg3hDADhtQADh0BEhHIA/AnQBQAzAZBuQAYBugvBSIgPgYg");
        this.shape_188.setTransform(51.9, 46.6);

        this.shape_189 = new cjs.Shape();
        this.shape_189.graphics.f("#4383A5").s().p("ABLC2QgUgUghgEQgGgBgJAMIgSAUQgbAXgjgqQg2hCAEhwQAEh3BEhHIA/AoQBQAzAYBxQAYBwgxBRIgQgRg");
        this.shape_189.setTransform(51.9, 46.9);

        this.shape_190 = new cjs.Shape();
        this.shape_190.graphics.f("#3C7EA0").s().p("ABIDAQgVgNgggEQgGgBgKAJIgSAOQgbAOgggnQg3hCAGhyQAFh5BEhHIA/AnQBQA0AYBzQAYB0g0BPIgRgJg");
        this.shape_190.setTransform(51.8, 47.1);

        this.shape_191 = new cjs.Shape();
        this.shape_191.graphics.f("#35799C").s().p("AhMCsQg2hBAGh1QAHh5BEhIIA/AnQBRA0AXB2QAXB2g1BOQgDACgQgDQgdgGgXgDQgVAIgPADIgHABQgYAAgaggg");
        this.shape_191.setTransform(51.8, 47.5);

        this.shape_192 = new cjs.Shape();
        this.shape_192.graphics.f("#2D7498").s().p("AAODOQgWADgPgBQgbgDgbghQg2hBAHh3QAIh8BFhIIA+AoQBRAzAXB5QAWB5g3BNQgNAHgYAAQgPAAgUgDg");
        this.shape_192.setTransform(51.7, 48);

        this.shape_193 = new cjs.Shape();
        this.shape_193.graphics.f("#257094").s().p("AAMDZQgggGgHgCQgagKgaggQg1hBAIh5QAJh+BFhIIA/AoQBRAzAWB9QAWB7g5BMQgJAIgMAFQgQAHgTAAIgRgBg");
        this.shape_193.setTransform(51.7, 48.9);

        this.shape_194 = new cjs.Shape();
        this.shape_194.graphics.f("#1E6B90").s().p("AhQChQg1hAAJh8QAKh/BFhIIA/AnQBRA0AWB/QAVB+g7BLQgSAZgcAHQgIACgIAAQguAAg3hCg");
        this.shape_194.setTransform(51.6, 49.9);

        this.shape_195 = new cjs.Shape();
        this.shape_195.graphics.f("#4FC0D9").s().p("AiDBDIg+grQAkhXBdggQBRgdBYAXQBjAbhqBRQg1AphFApQAVApBlgrQAygVAugZQhIA+hWAIIgYABQhLAAhEgtg");
        this.shape_195.setTransform(29.5, 78);

        this.shape_196 = new cjs.Shape();
        this.shape_196.graphics.f("#4CB8D2").s().p("AiFBFIg/gqQAlhYBfgiQBSgfBYAXQBiAbhlBQQgcAXg0AgQgoAZABACQAUAnBjgqQAxgUAtgYQhIA/hYAKIgcABQhKAAhEgsg");
        this.shape_196.setTransform(29.8, 77.8);

        this.shape_197 = new cjs.Shape();
        this.shape_197.graphics.f("#48B2CC").s().p("AiHBHIg+gqQAkhYBggkQBVghBWAYQBjAahiBQQgaAWgzAgQgmAZABACQASAlBggoQAwgUArgXQhHBBhZALQgRACgQAAQhKAAhCgsg");
        this.shape_197.setTransform(30, 77.7);

        this.shape_198 = new cjs.Shape();
        this.shape_198.graphics.f("#44ABC7").s().p("AiJBJIg+gqQAlhYBggmQBXgiBWAXQBiAaheBQQgZAVgxAhQglAZAAACQATAiBdgnQAugTAqgWQhIBChZAMQgTADgTAAQhJAAhBgrg");
        this.shape_198.setTransform(30.2, 77.5);

        this.shape_199 = new cjs.Shape();
        this.shape_199.graphics.f("#41A6C2").s().p("AiLBMIg+gqQAkhZBignQBYglBXAXQBhAbhZBPQgYAVgwAgQgkAZABACQASAhBagmQAsgTApgVQhIBDhaAOQgVAEgUAAQhJAAhBgqg");
        this.shape_199.setTransform(30.5, 77.4);

        this.shape_200 = new cjs.Shape();
        this.shape_200.graphics.f("#3DA0BD").s().p("AiNBOIg+gqQAlhZBjgpQBagnBVAYQBiAahWBPQgXAVguAgQgjAYABACQARAeBXgkQArgSAogTQhIBEhbAPQgYAEgWAAQhIAAhAgpg");
        this.shape_200.setTransform(30.7, 77.2);

        this.shape_201 = new cjs.Shape();
        this.shape_201.graphics.f("#3A9AB9").s().p("AiOBQIg/gqQAlhZBkgrQBcgoBVAXQBiAahSBPQgWAUgtAgQghAZABACQAPAcBVgjQApgSAngSQhHBFhdARQgaAFgXAAQhJAAg+gpg");
        this.shape_201.setTransform(30.9, 77.1);

        this.shape_202 = new cjs.Shape();
        this.shape_202.graphics.f("#3695B4").s().p("AiRBSIg+gqQAlhZBmgtQBegqBUAXQBhAahOBOQgVAUgqAgQghAYABACQAPAaBRghIBOgiQhHBGheATQgcAFgZAAQhIAAg/gog");
        this.shape_202.setTransform(31.1, 77);

        this.shape_203 = new cjs.Shape();
        this.shape_203.graphics.f("#3390B0").s().p("AiTBUIg+gqQAlhZBngvQBfgsBUAXQBhAahKBOQgUATgoAgQggAYACADQANAYBPghIBLggQhHBIhfAUQgeAGgbAAQhIAAg+gog");
        this.shape_203.setTransform(31.4, 76.8);

        this.shape_204 = new cjs.Shape();
        this.shape_204.graphics.f("#308BAB").s().p("AiVBXIg+gqQAmhaBngxQBiguBTAXQBhAbhGBMQgUAUgnAfQgdAZABACQAMAWBMgfIBIgfQhGBJhgAWQggAHgdAAQhHAAg+gng");
        this.shape_204.setTransform(31.6, 76.7);

        this.shape_205 = new cjs.Shape();
        this.shape_205.graphics.f("#2D86A7").s().p("AiWBZIg+gqQAkhaBpgzQBkgwBTAXQBgAahDBNQgRATgmAfQgcAYABADQAMATBJgeIBFgcQhGBKhiAXQgiAIgfAAQhGAAg8gmg");
        this.shape_205.setTransform(31.9, 76.6);

        this.shape_206 = new cjs.Shape();
        this.shape_206.graphics.f("#2A81A3").s().p("AiYBbIg+gqQAlhbBqg0QBkgxBTAWQBhAbg/BLQgRATgkAgQgbAYACACQALASBGgdIBCgbQhGBMhjAYQgjAJghAAQhGAAg8gmg");
        this.shape_206.setTransform(32.1, 76.4);

        this.shape_207 = new cjs.Shape();
        this.shape_207.graphics.f("#287C9F").s().p("AiaBdIg/gqQAmhaBrg2QBmg0BTAWQBgAbg7BLQgPATgiAfQgaAYACACQAJAQBDgcIBBgZQhHBNhjAaQgnAKgjAAQhFAAg7gmg");
        this.shape_207.setTransform(32.3, 76.3);

        this.shape_208 = new cjs.Shape();
        this.shape_208.graphics.f("#25789B").s().p("AicBfIg+gqQAlhbBtg3QBog2BSAWQBgAbg3BKQgPATggAfQgZAXACADQAIANBBgaQA9gZAAACQhGBOhlAcQgoAKgkAAQhFAAg7glg");
        this.shape_208.setTransform(32.5, 76.2);

        this.shape_209 = new cjs.Shape();
        this.shape_209.graphics.f("#227397").s().p("AieBhIg+gqQAlhbBug5QBpg4BSAWQBgAbgzBKQgNATgfAeQgYAXACADQAIALA9gYQA7gYAAACQhFBPhnAdQgqAMgmAAQhEAAg7glg");
        this.shape_209.setTransform(32.8, 76);

        this.shape_210 = new cjs.Shape();
        this.shape_210.graphics.f("#206F94").s().p("AigBjIg+gqQAmhbBvg8QBrg5BRAWQBfAbgvBJQgMATgdAeQgWAXACADQAGAJA7gXQA4gXAAACQhFBRhoAfQgsANgoAAQhEAAg6glg");
        this.shape_210.setTransform(33, 75.9);

        this.shape_211 = new cjs.Shape();
        this.shape_211.graphics.f("#1E6B90").s().p("AiiBlIg+gqQAlhbBxg9QBsg8BRAXQBfAagqBJQgMASgcAeQgVAYADADQAFAHA4gXQA2gVAAADQhFBShpAgQguAOgpAAQhEAAg6glg");
        this.shape_211.setTransform(33.3, 75.8);

        this.shape_212 = new cjs.Shape();
        this.shape_212.graphics.f("#1E6B90").s().p("AiLEvQgogLhXg2QANAHADg4QAEg8APADQBQAMAzgwQAogmAfhVQAfhpASgyQAfhZAngoIA/AnQBMAwAaBWQAYBQgYBaQgYBag+BGQhCBLhcAeQguAPgqAAQggAAgegJg");
        this.shape_212.setTransform(38.1, 58.4);

        this.shape_213 = new cjs.Shape();
        this.shape_213.graphics.rf(["#666666", "rgba(102,102,102,0)"], [0, 0.957], -10.2, 0, 0, -10.2, 0, 41.4).s().p("AiGBOIgzgKQh3gcAAgoQAAgnB3gcIAzgKQA+gLBJgEQBnAGBSATQB3AcAAAnQAAAoh3AcQhSAThoAGQhJgEg9gLg");
        this.shape_213.setTransform(47.9, 85.1);

        this.timeline.addTween(cjs.Tween.get({}).to({ state: [{ t: this.shape_213 }, { t: this.shape_212 }, { t: this.shape_211 }, { t: this.shape_210 }, { t: this.shape_209 }, { t: this.shape_208 }, { t: this.shape_207 }, { t: this.shape_206 }, { t: this.shape_205 }, { t: this.shape_204 }, { t: this.shape_203 }, { t: this.shape_202 }, { t: this.shape_201 }, { t: this.shape_200 }, { t: this.shape_199 }, { t: this.shape_198 }, { t: this.shape_197 }, { t: this.shape_196 }, { t: this.shape_195 }, { t: this.shape_194 }, { t: this.shape_193 }, { t: this.shape_192 }, { t: this.shape_191 }, { t: this.shape_190 }, { t: this.shape_189 }, { t: this.shape_188 }, { t: this.shape_187 }, { t: this.shape_186 }, { t: this.shape_185 }, { t: this.shape_184 }, { t: this.shape_183 }, { t: this.shape_182 }, { t: this.shape_181 }, { t: this.shape_180 }, { t: this.shape_179 }, { t: this.shape_178 }, { t: this.shape_177 }, { t: this.shape_176 }, { t: this.shape_175 }, { t: this.shape_174 }, { t: this.shape_173 }, { t: this.shape_172 }, { t: this.shape_171 }, { t: this.shape_170 }, { t: this.shape_169 }, { t: this.shape_168 }, { t: this.shape_167 }, { t: this.shape_166 }, { t: this.shape_165 }, { t: this.shape_164 }, { t: this.shape_163 }, { t: this.shape_162 }, { t: this.shape_161 }, { t: this.shape_160 }, { t: this.shape_159 }, { t: this.shape_158 }, { t: this.shape_157 }, { t: this.shape_156 }, { t: this.shape_155 }, { t: this.shape_154 }, { t: this.shape_153 }, { t: this.shape_152 }, { t: this.shape_151 }, { t: this.shape_150 }, { t: this.shape_149 }, { t: this.shape_148 }, { t: this.shape_147 }, { t: this.shape_146 }, { t: this.shape_145 }, { t: this.shape_144 }, { t: this.shape_143 }, { t: this.shape_142 }, { t: this.shape_141 }, { t: this.shape_140 }, { t: this.shape_139 }, { t: this.shape_138 }, { t: this.shape_137 }, { t: this.shape_136 }, { t: this.shape_135 }, { t: this.shape_134 }, { t: this.shape_133 }, { t: this.shape_132 }, { t: this.shape_131 }, { t: this.shape_130 }, { t: this.shape_129 }, { t: this.shape_128 }, { t: this.shape_127 }, { t: this.shape_126 }, { t: this.shape_125 }, { t: this.shape_124 }, { t: this.shape_123 }, { t: this.shape_122 }, { t: this.shape_121 }, { t: this.shape_120 }, { t: this.shape_119 }, { t: this.shape_118 }, { t: this.shape_117 }, { t: this.shape_116 }, { t: this.shape_115 }, { t: this.shape_114 }, { t: this.shape_113 }, { t: this.shape_112 }, { t: this.shape_111 }, { t: this.shape_110 }, { t: this.shape_109 }, { t: this.shape_108 }, { t: this.shape_107 }, { t: this.shape_106 }, { t: this.shape_105 }, { t: this.shape_104 }, { t: this.shape_103 }, { t: this.shape_102 }, { t: this.shape_101 }, { t: this.shape_100 }, { t: this.shape_99 }, { t: this.shape_98 }, { t: this.shape_97 }, { t: this.shape_96 }, { t: this.shape_95 }, { t: this.shape_94 }, { t: this.shape_93 }, { t: this.shape_92 }, { t: this.shape_91 }, { t: this.shape_90 }, { t: this.shape_89 }, { t: this.shape_88 }, { t: this.shape_87 }, { t: this.shape_86 }, { t: this.shape_85 }, { t: this.shape_84 }, { t: this.shape_83 }, { t: this.shape_82 }, { t: this.shape_81 }, { t: this.shape_80 }, { t: this.shape_79 }, { t: this.shape_78 }, { t: this.shape_77 }, { t: this.shape_76 }, { t: this.shape_75 }, { t: this.shape_74 }, { t: this.shape_73 }, { t: this.shape_72 }, { t: this.shape_71 }, { t: this.shape_70 }, { t: this.shape_69 }, { t: this.shape_68 }, { t: this.shape_67 }, { t: this.shape_66 }, { t: this.shape_65 }, { t: this.shape_64 }, { t: this.shape_63 }, { t: this.shape_62 }, { t: this.shape_61 }, { t: this.shape_60 }, { t: this.shape_59 }, { t: this.shape_58 }, { t: this.shape_57 }, { t: this.shape_56 }, { t: this.shape_55 }, { t: this.shape_54 }, { t: this.shape_53 }, { t: this.shape_52 }, { t: this.shape_51 }, { t: this.shape_50 }, { t: this.shape_49 }, { t: this.shape_48 }, { t: this.shape_47 }, { t: this.shape_46 }, { t: this.shape_45 }, { t: this.shape_44 }, { t: this.shape_43 }, { t: this.shape_42 }, { t: this.shape_41 }, { t: this.shape_40 }, { t: this.shape_39 }, { t: this.shape_38 }, { t: this.shape_37 }, { t: this.shape_36 }, { t: this.shape_35 }, { t: this.shape_34 }, { t: this.shape_33 }, { t: this.shape_32 }, { t: this.shape_31 }, { t: this.shape_30 }, { t: this.shape_29 }, { t: this.shape_28 }, { t: this.shape_27 }, { t: this.shape_26 }, { t: this.shape_25 }, { t: this.shape_24 }, { t: this.shape_23 }, { t: this.shape_22 }, { t: this.shape_21 }, { t: this.shape_20 }, { t: this.shape_19 }, { t: this.shape_18 }, { t: this.shape_17 }, { t: this.shape_16 }, { t: this.shape_15 }, { t: this.shape_14 }, { t: this.shape_13 }, { t: this.shape_12 }, { t: this.shape_11 }, { t: this.shape_10 }, { t: this.shape_9 }, { t: this.shape_8 }, { t: this.shape_7 }, { t: this.shape_6 }, { t: this.shape_5 }, { t: this.shape_4 }, { t: this.shape_3 }, { t: this.shape_2 }, { t: this.shape_1 }, { t: this.shape }] }).wait(1));

    }).prototype = this.getMCSymbolPrototype(lib.clock_MC, new cjs.Rectangle(0, 0, 78.5, 94.5), null);

    // Animation with dynamic text
    (lib.getExportRoot = function (mode, startPosition, loop, txt) {
        this.initialize(mode, startPosition, loop, { "in": 0, out: 20 });

        // clock
        this.instance = new lib.clock_MC();
        this.instance.parent = this;
        this.instance.setTransform(500, 83.2, 1, 1, 0, 0, 0, 41, 46);
        this.instance.alpha = 0;
        this.instance._off = true;

        this.timeline.addTween(cjs.Tween.get(this.instance)
            .wait(11).to({ _off: false }, 0)
            .to({ y: 62.2, alpha: 1 }, 3)
            .to({ y: 73.2 }, 2)
            //.wait(5)
            //.to({ y: 62.2 }, 2)
            //.to({ y: 83.2, alpha: 0 }, 3)
            //.wait(9)
        );

        // White strip
        var bb = new AnimationWithWhiteStrip(lib, img, cjs, lib.txt);
        bb.showAnimatedText(this, lib.txt || txt);

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = null;
    // library properties:
    lib.properties = {
        width: 666,
        height: 250,
        fps: 24,
        color: "#FFFFFF",
        opacity: 1.00,
        webfonts: {},
        manifest: [],
        preloads: []
    };
}
AnimationWithWhiteStripAndTimer.prototype = Object.create(CommonAnimationBase.prototype);
AnimationWithWhiteStripAndTimer.prototype.constructor = CommonAnimationBase;