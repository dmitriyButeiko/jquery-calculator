(function($){
    $.fn.calculator = init;
    var container = {};
    var openBraceNesting = 0;
    var equalsUsed = false;
    
    function customizeContainer(container)
    {
         container.css({
             'background-color' : 'black',
             'width'            : '300px',
             'height'           : '530px'
          });
    }
    function addKey(container, keyValue)
    {
            var key;
            switch(keyValue)
            {
                case 'backspace':
                    key = $('<div class="key"><span><img src="calculator/img/backspaceIcon2.png"></img></span></div>');
                    key.find('img').css({
                        'width' : '35px',
                        'padding' : '0px',
                        'display' : 'inline-block',
                        'padding-top' : '14px',
                        'margin-right' : '4px'
                    });
                    key.css({
                        'position' : 'relative',
                        'top'      : '6.1px'
                    });
                    break;
                default:
                    key = $('<div class="key"><span>'  + keyValue  +'</span></div>');
                    key.find('span').css({
                            'display' : 'inline-block',
                            'padding-top' : '4.5px'
                    });
            }
            key.css({
                 'background-color' : 'white',
                 'display'          : 'inline-block',
                 'font-size'        : '40px',
                 'max-width'        : '60px',
                 'margin-top'       : '10px',
                 'margin-bottom'    : '0px',
                 'min-width'        : '60px',
                 '-webkit-touch-callout' : 'none',
                 '-webkit-user-select': 'none',
                 '-khtml-user-select': 'none',
                 '-moz-user-select' : 'none',
                 'user-select' :     'none',
                 'margin-left'      : '10px',
                 'max-height'       : '60px',
                 'min-height'       : '60px',
                 'text-align'       : 'center',
                 'font-family'      : 'Roboto, sans-serif',
                 'border-radius'    : '20px'
            });
            key.find('span').hover(function(){
                $(this).css({
                    'cursor' : 'default'
                });
            });
            container.append(key);
    }
    function addKeys(keysPanel)
    {
        addKey(keysPanel, 'C');
        addKey(keysPanel, '%');
        addKey(keysPanel, 'X');
        addKey(keysPanel, 'backspace');
        addKey(keysPanel, '7');
        addKey(keysPanel, '8');
        addKey(keysPanel, '9');
        addKey(keysPanel, '-');
        addKey(keysPanel, '4');
        addKey(keysPanel, '5');
        addKey(keysPanel, '6');
        addKey(keysPanel, '+');
        addKey(keysPanel, '1');
        addKey(keysPanel, '2');
        addKey(keysPanel, '3');
        addKey(keysPanel, '()');
        addKey(keysPanel, '0');
        addKey(keysPanel, '.');
        addKey(keysPanel, '+/-');
        addKey(keysPanel, '=');


    }
    function isLastNumberPositive(text)
    {
        console.log('First Changing');
        
        for(var i = (text.length - 1); i > (-1); i--)
        {
            switch(text[i])
            {
                case '+':
                    return true;
                    break;
                case '-':
                    if(text[i-1] == '(')
                    {
                        return false;
                    }
                    else
                    {
                        return true;
                    }
                    
                    break;
                case '%':
                    return true;
                    break;
                case 'X':
                    return true;
                    break;
            }
        }
        
        return true;
    }
    function changeLastNumberToPositive(text)
    {
        var result = text;
        for(var i = (result.length - 1);i>0;i--)
        {
            if(result[i] == '-')
            {
                break;
            }
        }

        openBraceNesting--;
        var firstPart = result.substr(0, i-1);
        var secondPart = result.substr(i+1, result.length);
        result  = firstPart + secondPart;
        
        return result;
    }
    function createPanels(container)
    {
        var displayPanel = $('<div id="displayPanel"></div>');
        
        displayPanel.css({
            width : '100%',
            height : '30%',
            background : 'black',
            'font-family' : "'Sigmar One', cursive",
            'font-size'   : '2em',
            'word-wrap'   : 'break-word',
            color      : 'white',
            'overflow-y' : 'auto'
        });
        
        var keysPanel    = $('<div id="keysPanel"></div>');
        
        keysPanel.css({
            width : '100%',
            height : '70%',
            background : 'green',
            'font-size'         : '0'
        });


        addKeys(keysPanel);
        container.append(displayPanel);
        container.append(keysPanel);
    }
    function addClickEffect() {
        var keysPanel = container.find('#keysPanel');
        keysPanel.mouseover(function () {
            $(this).find('.key').mousedown(function () {
                $(this).css({
                    'background-color': 'red'
                });
            });
            $(this).find('.key').mouseup(function () {
                $(this).css({
                    'background-color': 'white'
                });
                updateDisplay.call(this);
            });
        });
        
        keysPanel.mouseout(function () {
            $(this).find('.key').unbind('mousedown');
            $(this).find('.key').unbind('mouseup');
        });
    }

    function changeLastNumberToNegative(text)
    {
        var result = text;
        var resolved = false;
        
        for(var i = (result.length-1);i>-1;i--)
        {
            switch(result[i])
            {
                case '-':
                case '+':
                case 'X':
                case '%':
                case '(':
                    resolved = true;
                    break;
            }
            
            if(resolved)
            {
                break;
            }
        }
        
        openBraceNesting++;
        var startPart = result.substr(0,i+1);
        var middlePart = '(-';
        var lastPart = result.substr(i+1);
        var res = startPart + middlePart + lastPart;
        
        return res;
    }
    function addHandlers()
    {
        addClickEffect();
    }
    function lastNumberAvailability(text)
    {
        switch(text[text.length-1])
        {
            case '+':
            case '-':
            case '%':
            case 'X':
            case '(':
            case ')':
                return false;
                break;
            default:
                if(text == '')
                {
                    return false;
                }
                else
                {
                    return true;
                }
        }
    }

    function clearDisplay(display)
    {
        equalsUsed = false;
        openBraceNesting = 0;
        display.text('');
    }
    
    function checkDotPossibility(display)
    {
        var displayText = display.text();
        var displayTextLength = displayText.length;
        
        switch(displayText[displayTextLength-1])
        {
            case '+':
                return false;
                break;
            case '-':
                return false;
                break;
            case '.':
                return false;
                break;
            case 'X':
                return false;
                break;
            case '%':
                return false;
                break;
            case '(':
                return false;
                break;
            case ')':
                return false;
                break;
            default:
                if(displayText == '')
                {
                    return false;
                }
                else{
                    return true;
                }
        }
    }
    function prepareText(text)
    {
        var res = text.replace('X','*');
        res = res.replace('%','/');

        return res;
    }
    function checkOpenBracePossibility(display)
    {
        var displayText = display.text();
        var displayTextLength = displayText.length;
        
        switch(displayText[displayTextLength-1]) {
            case '+':
                return true;
                break;
            case '-':
                return true;
                break;
            case 'X':
                return true;
                break;
            case '%':
                return true;
                break;
            case '(':
                return true;
                break;
            default:
                if(displayText == '')
                {
                    return true;
                }
                
                return false;
        }
    }
    function checkCloseBracePossibility(display)
    {
        var displayText = display.text();
        var displayTextLength = displayText.length;
        
        switch(displayText[displayTextLength-1]) 
        {
            case '+':
                return false;
                break;
            case '-':
                return false;
                break;
            case 'X':
                return false;
                break;
            case '(':
                return false;
                break;
            case '%':
                return false;
                break;
            default:
                return true;
        }
    }
    function checkCharacterPossibility(display)
    {
        var displayText = display.text();
        var displayTextLength = displayText.length;
        
        switch(displayText[displayTextLength-1]) {
            case '+':
                return false;
                break;
            case '-':
                return false;
                break;
            case 'X':
                return false;
                break;
            case '%':
                return false;
                break;
            default:
                if(displayText == '')
                {
                    return false;
                }
                else{
                    return true;
                }
        }
    }
    function updateDisplay()
    {
        var display = container.find('#displayPanel');
          switch($(this).text()) {
              // backspace pressed
              case '':
                  if(equalsUsed)
                  {
                      clearDisplay(display);
                  }
                  var displayText = display.text();
                  if(displayText[displayText.length-1] == ')')
                  {
                      console.log('Nesting++');
                      openBraceNesting++;
                  }
                  if(displayText[displayText.length-1] == '(')
                  {
                      console.log('Nesting--');
                      openBraceNesting--;
                  }
                  display.text(display.text().substr(0, display.text().length - 1));
                  break;
              case '()':
                  if(openBraceNesting)
                  {
                      if(checkOpenBracePossibility(display))
                      {
                          display.text(display.text() + '(');
                          openBraceNesting++;
                      }
                      else
                      {
                          display.text(display.text() + ')');
                          openBraceNesting--;
                      }
                  }
                  else
                  {
                      if(checkOpenBracePossibility(display))
                      {
                          display.text(display.text() + '(');
                          openBraceNesting++;
                      }
                  }
                  break;
              case 'C' :
                  clearDisplay(display);
                  break;
              case '-':
                  if(checkCharacterPossibility(display))
                  {
                      display.text(display.text() + $(this).text());
                  }
                  break;
              case '+':
                  if(checkCharacterPossibility(display))
                  {
                      display.text(display.text() + $(this).text());
                  }
                  break;
              case 'X':
                  if(checkCharacterPossibility(display))
                  {
                      display.text(display.text() + $(this).text());
                  }
                  break;
              case '%':
                  if(checkCharacterPossibility(display))
                  {
                      display.text(display.text() + $(this).text());
                  }
                  break;
              case '.':
                  if(checkDotPossibility(display))
                  {
                      display.text(display.text() + $(this).text());
                  }
                  break;
              case '+/-':
                  if(equalsUsed)
                  {
                      clearDisplay(display)
                  }
                  if(lastNumberAvailability(display.text()))
                  {
                        console.log('Available');
                                  if(isLastNumberPositive(display.text())) {
                                      console.log('Available Positive');
                                      var text = changeLastNumberToNegative(display.text());
                                      display.text(text);
                                  }
                                  else
                                  {
                                      console.log('Negative');
                                      var text = changeLastNumberToPositive(display.text());
                                      display.text(text);
                                  }
                  }
                  else
                  {
                      console.log('Not Available');
                  }
                  break;
              case '=':
                  try
                  {
                      var text = display.text();
                      text = prepareText(text);
                      var res = eval(text);
                      display.text(display.text() + '=' + res);
                      equalsUsed = true;
                  }
                  catch(e)
                  {
                      console.log('Wrong Format');
                  }

                  break;
              default:
                 var displayText = display.text();

                  if(!(displayText[displayText.length-1] == ')'))
                  {
                      display.text(display.text() + $(this).text());
                  }
          }
    }
    function addUI()
    {
        customizeContainer(container);
        createPanels(container);
    }
    function init(parameters)
    {
        container = this;
        addUI();
        addHandlers();
    }
})(jQuery);
