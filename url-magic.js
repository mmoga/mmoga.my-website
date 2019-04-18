var f = ['🌑', '🌘', '🌗', '🌖', '🌕', '🌔', '🌓', '🌒'],
        d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        m = 0;

    function loop() {
        var s = '', x = 0;

        if (!m) {
            while (d[x] == 4) {
                x ++;
            }

            if (x >= d.length) m = 1;
            else {
                d[x] ++;
            }
        }
        else {
            while (d[x] == 0) {
                x ++;
            }

            if (x >= d.length) m = 0;
            else {
                d[x] ++;

                if (d[x] == 8) d[x] = 0;
            }
        }

        d.forEach(function (n) {
            s += f[n];
        });

        location.hash = s;

        setTimeout(loop, 50);
    }

    // loop();